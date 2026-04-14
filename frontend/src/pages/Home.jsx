import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCar, FaBolt, FaGem, FaArrowRight, FaCheck, FaClock, FaDollarSign, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Home = () => {
    const navigate = useNavigate();
    const [voitures, setVoitures] = useState([]);

    useEffect(() => {
        chargerVoitures();
    }, []);

    const chargerVoitures = async () => {
        try {
            const response = await axios.get('https://locationvoitureamal.alwaysdata.net/api/voitures');
            setVoitures((response.data['member'] || response.data['hydra:member'] || response.data).slice(0, 3));
        } catch (error) {
            console.error('Erreur API:', error);
        }
    };

    return (
        <div id="home" className="min-h-screen bg-gray-900">
            {/* Hero Section */}
            <div 
                className="relative h-screen flex items-center justify-center bg-cover bg-center"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1920)',
                }}
            >
                {/* Overlay sombre */}
                <div className="absolute inset-0 bg-black bg-opacity-70"></div>
                
                <div className="relative text-center text-white px-4 max-w-6xl mx-auto z-10">
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                        Découvrez le monde sur roues<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600">
                            avec notre service de location
                        </span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto">
                        Expérience premium, flotte exclusive, service impeccable
                    </p>
                    
                    <button 
                        onClick={() => navigate('/voitures')}
                        className="group flex items-center space-x-2 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 px-10 py-5 rounded-full text-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105"
                    >
                        <span>Réserver Maintenant</span>
                        <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
            {/* Section À propos */}
<div id="apropos" className="py-24 px-4 bg-white scroll-mt-20">
    <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">À propos de nous</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </div>
        
       <p className="text-xl text-gray-600 text-center mb-16 max-w-4xl mx-auto">
    DriveNow est votre partenaire de confiance pour la location de véhicules au Maroc
</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Qualité Premium */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaCheck className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Qualité Premium</h3>
                <p className="text-gray-600">
                    Une flotte de véhicules haut de gamme, récents et parfaitement entretenus pour votre confort
                </p>
            </div>

            {/* Service 24/7 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaClock className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Service 24/7</h3>
                <p className="text-gray-600">
                    Une équipe disponible à tout moment pour répondre à vos besoins et questions
                </p>
            </div>

            {/* Prix Compétitifs */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaDollarSign className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Prix Compétitifs</h3>
                <p className="text-gray-600">
                    Des tarifs transparents et compétitifs sans frais cachés ni surprises
                </p>
            </div>
        </div>
    </div>
</div>
         {/* Section Voitures Populaires */}
            <div className="py-24 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
                        Nos Véhicules Populaires
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {voitures.map(voiture => (
                            <div key={voiture.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                                <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                                    {voiture.image ? (
                                        <img 
                                            src={`https://locationvoitureamal.alwaysdata.net${voiture.image}`} 
                                            alt={voiture.marque} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FaCar className="text-gray-400 text-8xl" />
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{voiture.marque}</h3>
                                    <p className="text-gray-600 mb-4">{voiture.modele}</p>
                                    <div className="flex items-end justify-between">
                                        <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                            {voiture.prixJour} MAD
                                        </span>
                                        <button 
                                            onClick={() => navigate('/voitures')}
                                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                                        >
                                            Voir détails
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <button 
                            onClick={() => navigate('/voitures')}
                            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                        >
                            <span>Voir tous les véhicules</span>
                            <FaArrowRight />
                        </button>
                    </div>
                </div>
            </div>

            {/* Section Mission */}
{/* Section Mission */}
<div className="py-24 px-4 bg-white">
    <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Notre Mission</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-center text-white">
            <p className="text-xl mb-12 max-w-4xl mx-auto leading-relaxed">
                Chez DriveNow, notre mission est de vous offrir une expérience de location automobile exceptionnelle. 
                Nous mettons à votre disposition une sélection rigoureuse de véhicules premium, 
                un service client irréprochable et des solutions adaptées à tous vos besoins de mobilité.
            </p>

            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
                <div className="text-center">
                    <div className="text-5xl font-bold mb-2">500+</div>
                    <div className="text-blue-100 text-sm">Clients satisfaits</div>
                </div>
                <div className="text-center">
                    <div className="text-5xl font-bold mb-2">50+</div>
                    <div className="text-blue-100 text-sm">Véhicules premium</div>
                </div>
                <div className="text-center">
                    <div className="text-5xl font-bold mb-2">4 ans</div>
                    <div className="text-blue-100 text-sm">D'expérience</div>
                </div>
                <div className="text-center">
                    <div className="text-5xl font-bold mb-2">24/7</div>
                    <div className="text-blue-100 text-sm">Service client</div>
                </div>
            </div>
        </div>
    </div>
</div>
           {/* Section Contact */}
<div id="contact" className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black scroll-mt-20">
    <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-3">Contactez-nous</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mb-4"></div>
            <p className="text-base text-gray-400">
                Notre équipe est à votre disposition pour répondre à toutes vos questions
            </p>
        </div>

        {/* Informations de contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Téléphone */}
            <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                    <FaPhone className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Téléphone</h3>
                <p className="text-gray-400 text-sm mb-1">+212 5 22 33 44 55</p>
                <p className="text-gray-400 text-sm">+212 6 77 88 99 00</p>
            </div>

            {/* Email */}
            <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
                    <FaEnvelope className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Email</h3>
                <p className="text-gray-400 text-sm mb-1">contact@drivenow.ma</p>
                <p className="text-gray-400 text-sm">support@drivenow.ma</p>
            </div>

            {/* Adresse */}
            <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                    <FaMapMarkerAlt className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Adresse</h3>
                <p className="text-gray-400 text-sm mb-1">123 Boulevard Mohammed V</p>
                <p className="text-gray-400 text-sm">Casablanca, Maroc</p>
            </div>
        </div>

        {/* Horaires d'ouverture */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white text-center mb-6">Horaires d'ouverture</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Lundi - Vendredi</p>
                    <p className="text-white font-semibold">8h00 - 20h00</p>
                </div>
                <div className="text-center p-3 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Samedi</p>
                    <p className="text-white font-semibold">9h00 - 18h00</p>
                </div>
                <div className="text-center p-3 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Dimanche</p>
                    <p className="text-white font-semibold">10h00 - 16h00</p>
                </div>
                <div className="text-center p-3 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Service d'urgence</p>
                    <p className="text-blue-400 font-semibold">24/7</p>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-500 text-sm">
                © 2024 DriveNow. Tous droits réservés.
            </p>
        </div>
    </div>
</div>
        </div>
        
    );
};

export default Home;