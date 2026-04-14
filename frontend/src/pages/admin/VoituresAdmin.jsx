import { useEffect, useState } from 'react';
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VoituresAdmin = () => {
    const [voitures, setVoitures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        marque: '',
        modele: '',
        annee: '',
        prixJour: '',
        disponibilite: true,
        immatriculation: '',
        categorie: '',
        carburant: '',
        transmission: '',
        image: '',
    });

    // URL de base pour les images (backend Symfony)
    const IMAGE_BASE_URL = 'https://locationvoitureamal.alwaysdata.net'; //✅ hna fin kan mochkil mabanoch tsawr 3ndi

    useEffect(() => {
        fetchVoitures();
    }, []);

    const fetchVoitures = async () => {
        try {
            const response = await api.get('/voitures');
            const voituresData = response.data['hydra:member'] || response.data.member || response.data || [];
            if (Array.isArray(voituresData)) {
                setVoitures(voituresData);
            } else {
                setVoitures([]);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des voitures:', error);
            toast.error('Erreur lors du chargement des voitures');
            setVoitures([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/voitures', {
                ...formData,
                annee: parseInt(formData.annee),
                prixJour: formData.prixJour,  // ✅ Envoie un string (texte) kan fiha mochkil makatbghich tzad lia voiture 
                // (Le backend Symfony attend prixJour comme STRING (texte) Mais mon frontend envoie un DOUBLE (nombre décimal))
                                              
            }, {
                headers: {
                    'Content-Type': 'application/json'  // ✅ CORRIGÉ
                }
            });
            toast.success('Voiture ajoutée avec succès !');
            setShowForm(false);
            setFormData({
                marque: '', modele: '', annee: '', prixJour: '',
                disponibilite: true, immatriculation: '', categorie: '',
                carburant: '', transmission: '', image: '',
            });
            fetchVoitures();
        } catch (error) {
            console.error('Erreur lors de l\'ajout:', error);
            toast.error('Erreur lors de l\'ajout de la voiture');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Confirmer la suppression ?')) return;
        try {
            await api.delete(`/voitures/${id}`);
            toast.success('Voiture supprimée !');
            fetchVoitures();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            toast.error('Erreur lors de la suppression');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <ToastContainer />
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">🚗 Gestion des Voitures</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                    >
                        {showForm ? 'Annuler' : '+ Ajouter une voiture'}
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white p-6 rounded-lg shadow mb-8">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Ajouter une voiture</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Marque *</label>
                                <input type="text" name="marque" value={formData.marque}
                                    onChange={handleChange} required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Modèle *</label>
                                <input type="text" name="modele" value={formData.modele}
                                    onChange={handleChange} required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Année *</label>
                                <input type="number" name="annee" value={formData.annee}
                                    onChange={handleChange} required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Prix/Jour (MAD) *</label>
                                <input type="number" step="0.01" name="prixJour" value={formData.prixJour}
                                    onChange={handleChange} required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Immatriculation *</label>
                                <input type="text" name="immatriculation" value={formData.immatriculation}
                                    onChange={handleChange} required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                <input type="text" name="categorie" value={formData.categorie}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Carburant</label>
                                <select name="carburant" value={formData.carburant}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="Essence">Essence</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Electrique">Électrique</option>
                                    <option value="Hybride">Hybride</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission *</label>
                                <select name="transmission" value={formData.transmission}
                                    onChange={handleChange} required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="Manuelle">Manuelle</option>
                                    <option value="Automatique">Automatique</option>
                                </select>
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" name="disponibilite" checked={formData.disponibilite}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Disponible</span>
                                </label>
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image (nom du fichier)</label>
                                <input type="text" name="image" value={formData.image}
                                    onChange={handleChange}
                                    placeholder="ex: audi-a4.jpg"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">Nom du fichier image dans /uploads/voitures/</p>
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <button type="submit"
                                    className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                                >
                                    Ajouter la voiture
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {voitures.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-gray-500 bg-white rounded-lg">
                            Aucune voiture trouvée
                        </div>
                    ) : (
                        voitures.map((voiture) => {
                            const voitureId = voiture.id || voiture['@id']?.replace('/api/voitures/', '');
                            const imageName = voiture.image || voiture.imageUrl;
                            return (
                                <div key={voitureId} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
                                    <div className="h-48 bg-gray-200 relative">
                                        {imageName ? (
                                            <img
                                                src={`${IMAGE_BASE_URL}${imageName}`}
                                                alt={voiture.modele}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-sm">Image indisponible</div>';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                                Pas d'image
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-gray-900">{voiture.marque} {voiture.modele}</h3>
                                        <p className="text-sm text-gray-500">{voiture.annee}</p>
                                        <p className="text-xl font-bold text-purple-600 mt-2">{voiture.prixJour} MAD /jour</p>
                                        <p className="text-sm text-gray-600 mt-1">{voiture.carburant} • {voiture.transmission}</p>
                                        <p className="text-xs text-gray-400 mt-1">🚗 {voiture.immatriculation}</p>
                                        <div className="mt-3">
                                            {voiture.disponibilite ? (
                                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">✅ Disponible</span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">❌ Louée</span>
                                            )}
                                        </div>
                                        <div className="mt-4 flex space-x-2">
                                            <button
                                                onClick={() => handleDelete(voitureId)}
                                                className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm"
                                            >
                                                🗑️ Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default VoituresAdmin;