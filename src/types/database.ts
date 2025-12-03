export interface Agence {
  id: string;
  nom: string;
  ville: string;
  adresse: string | null;
  telephone: string | null;
  email: string | null;
  horaires: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

export interface Voiture {
  id: string;
  marque: string;
  modele: string;
  categorie: 'economique' | 'compacte' | 'berline' | 'suv' | 'luxe' | 'utilitaire';
  prix_jour: number;
  boite: 'manuelle' | 'automatique';
  carburant: 'essence' | 'diesel' | 'hybride' | 'electrique';
  places: number;
  portes: number;
  climatisation: boolean;
  image_url: string | null;
  images: string[];
  description: string | null;
  caracteristiques: Record<string, unknown>;
  agence_id: string | null;
  disponible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Option {
  id: string;
  nom: string;
  description: string | null;
  prix_jour: number;
  icone: string | null;
  created_at: string;
}

export interface Client {
  id: string;
  user_id: string | null;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string | null;
  ville: string | null;
  permis_numero: string | null;
  permis_date_emission: string | null;
  date_naissance: string | null;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  numero_reservation: string;
  voiture_id: string;
  client_id: string | null;
  agence_retrait_id: string | null;
  agence_retour_id: string | null;
  date_debut: string;
  date_fin: string;
  heure_retrait: string;
  heure_retour: string;
  options_ids: string[];
  prix_voiture: number;
  prix_options: number;
  prix_total: number;
  statut: 'en_attente' | 'confirmee' | 'en_cours' | 'terminee' | 'annulee';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type CategorieVoiture = Voiture['categorie'];
export type BoiteVitesse = Voiture['boite'];
export type Carburant = Voiture['carburant'];
export type StatutReservation = Reservation['statut'];
