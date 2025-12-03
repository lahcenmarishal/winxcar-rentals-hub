-- Table des agences/villes
CREATE TABLE public.agences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    ville TEXT NOT NULL,
    adresse TEXT,
    telephone TEXT,
    email TEXT,
    horaires TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des voitures
CREATE TABLE public.voitures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    marque TEXT NOT NULL,
    modele TEXT NOT NULL,
    categorie TEXT NOT NULL CHECK (categorie IN ('economique', 'compacte', 'berline', 'suv', 'luxe', 'utilitaire')),
    prix_jour DECIMAL(10, 2) NOT NULL,
    boite TEXT NOT NULL CHECK (boite IN ('manuelle', 'automatique')),
    carburant TEXT NOT NULL CHECK (carburant IN ('essence', 'diesel', 'hybride', 'electrique')),
    places INTEGER NOT NULL DEFAULT 5,
    portes INTEGER NOT NULL DEFAULT 5,
    climatisation BOOLEAN DEFAULT true,
    image_url TEXT,
    images TEXT[] DEFAULT '{}',
    description TEXT,
    caracteristiques JSONB DEFAULT '{}',
    agence_id UUID REFERENCES public.agences(id) ON DELETE SET NULL,
    disponible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des options de location
CREATE TABLE public.options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    description TEXT,
    prix_jour DECIMAL(10, 2) NOT NULL,
    icone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des clients
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL,
    telephone TEXT NOT NULL,
    adresse TEXT,
    ville TEXT,
    permis_numero TEXT,
    permis_date_emission DATE,
    date_naissance DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des réservations
CREATE TABLE public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_reservation TEXT UNIQUE NOT NULL DEFAULT ('RES-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT, 1, 8))),
    voiture_id UUID NOT NULL REFERENCES public.voitures(id) ON DELETE RESTRICT,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    agence_retrait_id UUID REFERENCES public.agences(id),
    agence_retour_id UUID REFERENCES public.agences(id),
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    heure_retrait TIME DEFAULT '09:00',
    heure_retour TIME DEFAULT '18:00',
    options_ids UUID[] DEFAULT '{}',
    prix_voiture DECIMAL(10, 2) NOT NULL,
    prix_options DECIMAL(10, 2) DEFAULT 0,
    prix_total DECIMAL(10, 2) NOT NULL,
    statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'confirmee', 'en_cours', 'terminee', 'annulee')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour la recherche de disponibilité
CREATE INDEX idx_reservations_dates ON public.reservations(voiture_id, date_debut, date_fin);
CREATE INDEX idx_voitures_categorie ON public.voitures(categorie);
CREATE INDEX idx_voitures_disponible ON public.voitures(disponible);

-- Fonction pour vérifier la disponibilité d'une voiture
CREATE OR REPLACE FUNCTION public.check_voiture_disponibilite(
    p_voiture_id UUID,
    p_date_debut DATE,
    p_date_fin DATE,
    p_exclude_reservation_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM public.reservations
        WHERE voiture_id = p_voiture_id
        AND statut NOT IN ('annulee', 'terminee')
        AND (id != p_exclude_reservation_id OR p_exclude_reservation_id IS NULL)
        AND (
            (date_debut <= p_date_fin AND date_fin >= p_date_debut)
        )
    );
END;
$$;

-- Trigger pour mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_voitures_updated_at
    BEFORE UPDATE ON public.voitures
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_reservations_updated_at
    BEFORE UPDATE ON public.reservations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS Policies
ALTER TABLE public.agences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voitures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Agences: lecture publique
CREATE POLICY "Agences visibles par tous" ON public.agences FOR SELECT USING (true);

-- Voitures: lecture publique
CREATE POLICY "Voitures visibles par tous" ON public.voitures FOR SELECT USING (true);

-- Options: lecture publique
CREATE POLICY "Options visibles par tous" ON public.options FOR SELECT USING (true);

-- Clients: accès à son propre profil
CREATE POLICY "Clients peuvent voir leur profil" ON public.clients 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Clients peuvent créer leur profil" ON public.clients 
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Clients peuvent modifier leur profil" ON public.clients 
    FOR UPDATE USING (auth.uid() = user_id);

-- Réservations: accès à ses propres réservations
CREATE POLICY "Voir ses réservations" ON public.reservations 
    FOR SELECT USING (
        client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
        OR auth.uid() IS NOT NULL
    );
CREATE POLICY "Créer une réservation" ON public.reservations 
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Modifier ses réservations" ON public.reservations 
    FOR UPDATE USING (
        client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
    );

-- Insérer des données de démonstration
INSERT INTO public.agences (nom, ville, adresse, telephone, email, horaires) VALUES
('Winxcar Casablanca Centre', 'Casablanca', '123 Boulevard Mohammed V', '+212 522 123 456', 'casablanca@winxcar.ma', 'Lun-Sam: 8h-20h'),
('Winxcar Marrakech', 'Marrakech', '45 Avenue Mohammed VI', '+212 524 789 012', 'marrakech@winxcar.ma', 'Lun-Dim: 8h-22h'),
('Winxcar Rabat', 'Rabat', '78 Avenue Hassan II', '+212 537 456 789', 'rabat@winxcar.ma', 'Lun-Sam: 8h-19h'),
('Winxcar Tanger', 'Tanger', '12 Boulevard Pasteur', '+212 539 321 654', 'tanger@winxcar.ma', 'Lun-Sam: 9h-20h');

INSERT INTO public.options (nom, description, prix_jour, icone) VALUES
('GPS', 'Navigation GPS intégrée', 50, 'map-pin'),
('Siège bébé', 'Siège auto pour enfant (0-4 ans)', 40, 'baby'),
('Siège enfant', 'Rehausseur pour enfant (4-12 ans)', 30, 'armchair'),
('Assurance tous risques', 'Couverture complète sans franchise', 100, 'shield-check'),
('Conducteur additionnel', 'Ajout d''un conducteur supplémentaire', 60, 'users'),
('WiFi portable', 'Hotspot WiFi 4G illimité', 45, 'wifi');

INSERT INTO public.voitures (marque, modele, categorie, prix_jour, boite, carburant, places, portes, description, image_url) VALUES
('Dacia', 'Logan', 'economique', 250, 'manuelle', 'essence', 5, 4, 'Voiture économique idéale pour les trajets urbains. Fiable et économique en carburant.', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'),
('Renault', 'Clio', 'compacte', 300, 'manuelle', 'essence', 5, 5, 'Compacte polyvalente, parfaite pour la ville et les escapades.', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800'),
('Peugeot', '308', 'compacte', 350, 'automatique', 'diesel', 5, 5, 'Berline compacte moderne avec excellent confort de conduite.', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'),
('Volkswagen', 'Passat', 'berline', 450, 'automatique', 'diesel', 5, 4, 'Berline premium spacieuse, idéale pour les longs trajets professionnels.', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800'),
('BMW', 'Série 3', 'berline', 600, 'automatique', 'essence', 5, 4, 'Berline sportive alliant performance et élégance.', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'),
('Dacia', 'Duster', 'suv', 400, 'manuelle', 'diesel', 5, 5, 'SUV robuste parfait pour explorer le Maroc en toute liberté.', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800'),
('Toyota', 'RAV4', 'suv', 550, 'automatique', 'hybride', 5, 5, 'SUV hybride éco-responsable avec grande autonomie.', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800'),
('Mercedes', 'Classe E', 'luxe', 800, 'automatique', 'diesel', 5, 4, 'Luxe et prestige pour vos déplacements d''exception.', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800'),
('Renault', 'Kangoo', 'utilitaire', 350, 'manuelle', 'diesel', 2, 4, 'Utilitaire spacieux pour vos besoins professionnels.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800');