import { useState } from 'react';
import { FaUser, FaCalendar, FaCog, FaGasPump, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import api from '../services/api';
import { toast } from 'react-toastify';

const VoitureDetailsModal = ({ voiture, onClose, user }) => {
    if (!voiture) return null;

    // États pour le formulaire
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [nbJours, setNbJours] = useState(0);
    const [prixTotal, setPrixTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const calculerPrix = (debut, fin) => {
        if (!debut || !fin) return;
        const start = new Date(debut);
        const end = new Date(fin);
        if (end <= start) {
            setNbJours(0);
            setPrixTotal(0);
            return;
        }
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const jours = diffDays === 0 ? 1 : diffDays;
        setNbJours(jours);
        setPrixTotal(jours * (voiture.prixJour || voiture.prix_jour));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const reservationData = {
                dateDebut: new Date(dateDebut).toISOString(),
                dateFin: new Date(dateFin).toISOString(),
                voiture_id: voiture.id
            };
            console.log('DEBUG reservationData:', reservationData);
            const response = await api.post('/reservation', reservationData);
            toast.success(response.data.message || 'Réservation créée avec succès !');
            onClose();
        } catch (error) {
            if (error.response?.status === 409) {
                toast.error(error.response.data.error || 'Véhicule non disponible.');
            } else {
                toast.error('Une erreur est survenue.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            {/* Modal très compact : max-w-lg */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                
                {/* En-tête avec Image et Bouton Fermer */}
                <div className="relative h-48 bg-gray-100">
                    {voiture.image ? (
                        <img 
                            src={`https://locationvoitureamal.alwaysdata.net${voiture.image}`} 
                            alt={voiture.modele}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-6xl">🚗</div>
                    )}
                    
                    {/* Bouton Fermer */}
                    <button 
                        onClick={onClose}
                        className="absolute top-3 right-3 bg-white bg-opacity-90 hover:bg-white text-gray-800 rounded-full p-1.5 shadow-lg transition-all"
                    >
                        <FaTimes size={16} />
                    </button>

                    {/* Badge Catégorie */}
                    <span className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {voiture.categorie}
                    </span>
                </div>

                {/* Contenu Principal */}
                <div className="p-5">
                    {/* Titre */}
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                        {voiture.marque} {voiture.modele}
                    </h2>

                    {/* Caractéristiques - Grille compacte */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        <div className="text-center">
                            <FaUser className="text-blue-500 mx-auto mb-1" size={14} />
                            <p className="text-xs text-gray-500">Places</p>
                            <p className="font-semibold text-gray-900 text-sm">5</p>
                        </div>
                        <div className="text-center">
                            <FaCalendar className="text-purple-500 mx-auto mb-1" size={14} />
                            <p className="text-xs text-gray-500">Année</p>
                            <p className="font-semibold text-gray-900 text-sm">{voiture.annee}</p>
                        </div>
                        <div className="text-center">
                            <FaCog className="text-gray-400 mx-auto mb-1" size={14} />
                            <p className="text-xs text-gray-500">Boîte</p>
                            <p className="font-semibold text-gray-900 text-sm">{voiture.transmission}</p>
                        </div>
                        <div className="text-center">
                            <FaGasPump className="text-orange-500 mx-auto mb-1" size={14} />
                            <p className="text-xs text-gray-500">Énergie</p>
                            <p className="font-semibold text-gray-900 text-sm">{voiture.carburant}</p>
                        </div>
                    </div>

                    {/* Prix - Style épuré */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Prix par jour</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {voiture.prixJour || voiture.prix_jour} MAD
                        </p>
                    </div>

                    {/* Section Réservation - SANS fond coloré */}
                    {!user ? (
                        /* Message si non connecté */
                        <div className="text-center py-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <FaExclamationTriangle className="text-yellow-600 mx-auto mb-2" size={24} />
                            <h3 className="text-sm font-bold text-gray-800 mb-1">Connexion requise</h3>
                            <button 
                                onClick={() => window.location.href = '/login'}
                                className="mt-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                            >
                                Se connecter
                            </button>
                        </div>
                    ) : (
                        /* Formulaire - Design minimaliste sans fond coloré */
                        <form onSubmit={handleSubmit}>
                            <h3 className="text-sm font-bold text-gray-800 mb-3">Réserver ce véhicule</h3>
                            
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Début</label>
                                    <input 
                                        type="date" 
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        value={dateDebut}
                                        onChange={(e) => {
                                            setDateDebut(e.target.value);
                                            calculerPrix(e.target.value, dateFin);
                                        }}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Fin</label>
                                    <input 
                                        type="date" 
                                        required
                                        min={dateDebut || new Date().toISOString().split('T')[0]}
                                        value={dateFin}
                                        onChange={(e) => {
                                            setDateFin(e.target.value);
                                            calculerPrix(dateDebut, e.target.value);
                                        }}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Résumé du prix - Simple et clair */}
                            {nbJours > 0 && (
                                <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex justify-between items-center text-sm mb-1">
                                        <span className="text-gray-600">Durée :</span>
                                        <span className="font-medium text-green-600">{nbJours} jour(s)</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-sm">Total :</span>
                                        <span className="text-xl font-bold text-blue-600">{prixTotal} MAD</span>
                                    </div>
                                </div>
                            )}

                            {/* Boutons d'action */}
                            <div className="flex gap-2">
                                <button 
                                    type="button" 
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading || nbJours === 0}
                                    className={`flex-1 px-4 py-2 text-sm rounded-lg text-white font-medium transition-all ${
                                        loading || nbJours === 0
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                >
                                    {loading ? '...' : 'Confirmer'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VoitureDetailsModal;