import { useEffect, useState } from 'react';
import api from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MesReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyReservations();
    }, []);

    const fetchMyReservations = async () => {
        try {
            setLoading(true);
            const res = await api.get('/reservation/my');
            setReservations(res.data);
        } catch (error) {
            console.error("Erreur:", error);
            toast.error("Impossible de charger vos réservations.");
        } finally {
            setLoading(false);
        }
    };

    const handleAnnuler = async (id) => {
        try {
            await api.put(`/reservation/${id}/cancel`);
            toast.success("Réservation annulée avec succès.");
            fetchMyReservations();
        } catch (error) {
            console.error("Erreur annulation:", error);
            toast.error("Impossible d'annuler cette réservation.");
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    const getStatutConfig = (statut) => {
        switch (statut) {
            case 'confirmee':
                return { label: 'Confirmée', bg: 'bg-green-500', text: 'text-white' };
            case 'annulee':
                return { label: 'Annulée', bg: 'bg-red-500', text: 'text-white' };
            default:
                return { label: 'En attente', bg: 'bg-orange-500', text: 'text-white' };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-3"></div>
                    <p className="text-gray-600 text-sm font-medium">Chargement de vos réservations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <ToastContainer position="top-right" />
            <div className="max-w-7xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Mes Réservations</h1>
                    <p className="text-sm text-gray-500 mt-1">Gérez vos réservations de voitures.</p>
                </div>

                {reservations.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {reservations.map((res) => {
                            const statut = getStatutConfig(res.statut);
                            const peutAnnuler = res.statut === 'en_attente' || res.statut === 'confirmee';

                            return (
                                <div
                                    key={res.id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
                                >
                                    {/* Image + Badge */}
                                    <div className="relative">
                                        <img
                                            src={`http://127.0.0.1:8000${res.voiture?.image}`}
                                            alt={`${res.voiture?.marque} ${res.voiture?.modele}`}
                                            className="w-full h-44 object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x200?text=Voiture';
                                            }}
                                        />
                                        <span className={`absolute top-3 right-3 ${statut.bg} ${statut.text} text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
                                            {statut.label}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 space-y-3">
                                        {/* Nom voiture */}
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                            <span className="font-semibold text-gray-900 text-sm">
                                                {res.voiture?.marque} {res.voiture?.modele}
                                            </span>
                                        </div>

                                        {/* Dates */}
                                        <div className="flex items-start gap-2">
                                            <svg className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <div className="text-xs text-gray-600 space-y-0.5">
                                                <div>Du {formatDate(res.dateDebut)}</div>
                                                <div>Au {formatDate(res.dateFin)}</div>
                                            </div>
                                        </div>

                                        {/* Prix */}
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="font-bold text-indigo-600 text-base">
                                                {res.prixTotal} MAD
                                            </span>
                                        </div>

                                        {/* Bouton annuler */}
                                        {peutAnnuler && (
                                            <button
                                                onClick={() => handleAnnuler(res.id)}
                                                className="w-full mt-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors duration-150"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Annuler la réservation
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="mt-4 text-lg text-gray-500 font-medium">Aucune réservation pour le moment.</p>
                        <p className="text-sm text-gray-400">Louez votre première voiture pour voir vos réservations ici !</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MesReservations;