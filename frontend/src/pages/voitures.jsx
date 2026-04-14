import { useState, useEffect } from 'react';
import axios from 'axios';
// Import des icônes pour l'affichage des caractéristiques
import { FaUser, FaCalendar, FaCog, FaGasPump } from 'react-icons/fa';

// ✅ Import du contexte d'authentification (pour savoir si l'utilisateur est connecté)
import { useAuth } from '../context/AuthContext';

// ✅ Import du composant Modal Unique (qui contient à la fois les détails ET le formulaire)
import VoitureDetailsModal from '../components/VoitureDetailsModal';

// ✅ Import des notifications (Toasts) pour afficher les messages de succès/erreur
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Voitures = () => {
    // --- ÉTATS (STATE) ---
    
    // Liste complète des voitures reçues de l'API
    const [voitures, setVoitures] = useState([]);
    
    // État de chargement : true tant que l'API n'a pas répondu
    const [loading, setLoading] = useState(true);
    
    // État pour gérer l'ouverture du modal : 
    // - null = modal fermé
    // - objet voiture = modal ouvert avec les infos de cette voiture
    const [voitureDetails, setVoitureDetails] = useState(null);

    // Récupération de l'utilisateur connecté via le Contexte Auth
    // Si personne n'est connecté, 'user' sera null
    const { user } = useAuth();

    // État pour stocker les critères de filtrage choisis par l'utilisateur
    const [filtres, setFiltres] = useState({
        categorie: 'Tous types',
        transmission: 'Toutes',
        carburant: 'Tous',
        prixMax: ''
    });

    // --- EFFETS (USEEFFECT) ---

    // Au chargement initial du composant, on récupère les voitures
    useEffect(() => {
        chargerVoitures();
    }, []);

    // --- FONCTIONS MÉTIERS ---

    // Fonction asynchrone pour appeler l'API Backend et récupérer la liste des voitures
    const chargerVoitures = async () => {
        try {
            // Appel GET vers l'API Symfony
            const response = await axios.get('https://locationvoitureamal.alwaysdata.net/api/voitures');
            console.log('✅ Réponse API Voitures:', response.data);
            
            // Gestion de la structure de réponse (API Platform renvoie souvent dans 'hydra:member' ou 'member')
            const voituresData = response.data.member || response.data['hydra:member'] || response.data;
            
            if (Array.isArray(voituresData)) {
                setVoitures(voituresData);
            } else {
                console.error('❌ Erreur format données');
                setVoitures([]);
            }
            // Une fois les données reçues, on arrête le chargement
            setLoading(false);
        } catch (error) {
            console.error('Erreur API:', error);
            setLoading(false);
        }
    };

    // Fonction pour filtrer la liste des voitures selon les critères sélectionnés
    const filtrerVoitures = () => {
        return voitures.filter(voiture => {
            // Vérification Catégorie
            const matchCategorie = filtres.categorie === 'Tous types' || voiture.categorie === filtres.categorie;
            // Vérification Transmission
            const matchTransmission = filtres.transmission === 'Toutes' || voiture.transmission === filtres.transmission;
            // Vérification Carburant
            const matchCarburant = filtres.carburant === 'Tous' || voiture.carburant === filtres.carburant;
            
            // Vérification Prix (gère les deux noms de champs possibles : prixJour ou prix_jour)
            const prix = voiture.prixJour || voiture.prix_jour || 0;
            const matchPrix = filtres.prixMax === '' || parseFloat(prix) <= parseFloat(filtres.prixMax);
            
            // La voiture est gardée seulement si elle correspond à TOUS les critères
            return matchCategorie && matchTransmission && matchCarburant && matchPrix;
        });
    };

    // Application du filtrage pour obtenir la liste finale à afficher
    const voituresFiltrees = filtrerVoitures();

    // --- AFFICHAGE DE CHARGEMENT (SKELETON) ---
    // Si 'loading' est vrai, on affiche des faux blocs gris au lieu du spinner
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header Skeleton */}
                <div className="bg-gray-900 py-16">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <div className="h-12 bg-gray-700 rounded-lg w-3/4 mx-auto mb-4 animate-pulse"></div>
                        <div className="h-6 bg-gray-700 rounded w-1/2 mx-auto animate-pulse"></div>
                    </div>
                </div>
                {/* Contenu Principal Skeleton */}
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filtres Skeleton */}
                        <div className="w-full lg:w-80 bg-white rounded-2xl shadow-xl p-8 h-fit sticky top-4">
                            <div className="h-8 bg-gray-200 rounded w-3/4 mb-8 animate-pulse"></div>
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="mb-6">
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3 animate-pulse"></div>
                                    <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                        {/* Grille Voitures Skeleton */}
                        <div className="flex-1">
                            <div className="mb-8 bg-white rounded-xl p-6 shadow-lg">
                                <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, index) => (
                                    <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
                                        <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                                        <div className="p-5 space-y-4">
                                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[...Array(4)].map((_, i) => (
                                                    <div key={i} className="h-8 bg-gray-200 rounded-lg"></div>
                                                ))}
                                            </div>
                                            <div className="border-t border-gray-200 pt-4">
                                                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                                                <div className="h-10 bg-gray-200 rounded w-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- AFFICHAGE PRINCIPAL (RENDER) ---
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Conteneur pour les notifications Toast */}
            <ToastContainer position="top-right" />
            
            {/* Header de la page */}
            <div className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">Notre Collection DriveNow</h1>
                    <p className="text-2xl text-gray-400">Découvrez nos véhicules d'exception</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* --- SIDEBAR GAUCHE : FILTRES --- */}
                    <div className="w-full lg:w-80 bg-white rounded-2xl shadow-xl p-8 h-fit sticky top-4">
                        <h3 className="text-2xl font-bold mb-8 text-gray-800">Filtres de recherche</h3>
                        
                        {/* Filtre Catégorie */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Type de voiture</label>
                            <select 
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filtres.categorie}
                                onChange={(e) => setFiltres({...filtres, categorie: e.target.value})}
                            >
                                <option>Tous types</option>
                                <option>Berline</option>
                                <option>SUV</option>
                                <option>Sport</option>
                                <option>Citadine</option>
                                <option>Luxe</option>
                            </select>
                        </div>

                        {/* Filtre Transmission */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Transmission</label>
                            <select 
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filtres.transmission}
                                onChange={(e) => setFiltres({...filtres, transmission: e.target.value})}
                            >
                                <option>Toutes</option>
                                <option>Manuelle</option>
                                <option>Automatique</option>
                            </select>
                        </div>

                        {/* Filtre Carburant */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Type de carburant</label>
                            <select 
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filtres.carburant}
                                onChange={(e) => setFiltres({...filtres, carburant: e.target.value})}
                            >
                                <option>Tous</option>
                                <option>Essence</option>
                                <option>Diesel</option>
                                <option>Électrique</option>
                                <option>Hybride</option>
                            </select>
                        </div>

                        {/* Filtre Prix Max */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Prix maximum (MAD/jour)
                            </label>
                            <input 
                                type="number" min="0" step="10" placeholder="Ex: 500"
                                value={filtres.prixMax}
                                onChange={(e) => setFiltres({...filtres, prixMax: e.target.value})}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-2">Laissez vide pour voir tous les prix</p>
                        </div>

                        {/* Bouton Réinitialiser */}
                        <button 
                            onClick={() => setFiltres({categorie: 'Tous types', transmission: 'Toutes', carburant: 'Tous', prixMax: ''})}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>

                    {/* --- PARTIE DROITE : GRILLE DES VOITURES --- */}
                    <div className="flex-1">
                        {/* Compteur de résultats */}
                        <div className="mb-8 flex justify-between items-center bg-white rounded-xl p-6 shadow-lg">
                            <p className="text-xl text-gray-700">
                                <span className="font-bold text-2xl text-blue-600">{voituresFiltrees.length}</span> véhicules disponibles
                            </p>
                        </div>

                        {/* Message si aucun résultat */}
                        {voituresFiltrees.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                                <div className="text-6xl mb-4">😔</div>
                                <p className="text-gray-500 text-xl">Aucun véhicule ne correspond à vos critères</p>
                                <button 
                                    onClick={() => setFiltres({categorie: 'Tous types', transmission: 'Toutes', carburant: 'Tous', prixMax: ''})}
                                    className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Voir tous les véhicules
                                </button>
                            </div>
                        ) : (
                            /* Grille des cartes voitures */
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {voituresFiltrees.map(voiture => (
                                    <div key={voiture.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                        
                                        {/* Image de la voiture */}
                                        <div className="relative">
                                            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                                                {voiture.image ? (
                                                    <img 
                                                        src={`https://locationvoitureamal.alwaysdata.net${voiture.image}`} 
                                                        alt={`${voiture.marque} ${voiture.modele}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-gray-400 text-6xl">🚗</span>
                                                )}
                                            </div>
                                            {/* Badge Catégorie */}
                                            <span className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                                {voiture.categorie}
                                            </span>
                                        </div>

                                        {/* Contenu de la carte */}
                                        <div className="p-5">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{voiture.marque}</h3>
                                            <p className="text-sm text-gray-500 mb-5">{voiture.modele}</p>
                                            
                                            {/* Icônes des caractéristiques */}
                                            <div className="grid grid-cols-2 gap-2 mb-5">
                                                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-2 py-2">
                                                    <FaUser className="text-blue-500" size={16} />
                                                    <span className="text-gray-600 text-xs">5 places</span>
                                                </div>
                                                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-2 py-2">
                                                    <FaCalendar className="text-purple-500" size={16} />
                                                    <span className="text-gray-600 text-xs">{voiture.annee}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-2 py-2">
                                                    <FaCog className="text-gray-400" size={16} />
                                                    <span className="text-gray-600 text-xs">{voiture.transmission}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-2 py-2">
                                                    <FaGasPump className="text-orange-500" size={16} />
                                                    <span className="text-gray-600 text-xs">{voiture.carburant}</span>
                                                </div>
                                            </div>

                                            {/* Section Prix et Bouton d'action */}
                                            <div className="border-t border-gray-200 pt-4">
                                                <div className="mb-4">
                                                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                                        {voiture.prixJour || voiture.prix_jour} MAD
                                                    </span>
                                                    <span className="text-gray-400 text-xs ml-1">/ jour</span>
                                                </div>
                                                
                                                {/* ✅ BOUTON UNIQUE : Ouvre le modal complet */}
                                                <button 
                                                    onClick={() => setVoitureDetails(voiture)}
                                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                                                >
                                                    Réserver
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ✅ MODAL UNIQUE (Détails + Formulaire) */}
            {/* Ce modal s'affiche SEULEMENT si 'voitureDetails' n'est pas null */}
            {voitureDetails && (
                <VoitureDetailsModal 
                    voiture={voitureDetails} 
                    onClose={() => setVoitureDetails(null)} // Ferme le modal
                    user={user} // Passe l'utilisateur connecté pour vérifier les droits
                />
            )}
        </div>
    );
};

export default Voitures;