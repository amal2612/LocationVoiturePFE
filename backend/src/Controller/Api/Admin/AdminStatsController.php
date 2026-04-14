<?php

namespace App\Controller\Api\Admin;

// On importe les "Repositories" : ce sont nos outils pour LIRE la base de données
use App\Repository\ReservationRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

// Toutes les routes de ce fichier commenceront par /api/admin
#[Route('/api/admin')]
class AdminStatsController extends AbstractController
{
    /**
     * Route pour les statistiques du Dashboard (Cartes du haut)
     */
    #[Route('/stats-global', name: 'api_admin_stats_global', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')] // Sécurité : Seul l'admin peut appeler cette API
    public function getGlobalStats(ReservationRepository $resRepo, UserRepository $userRepo): JsonResponse
    {
        // On récupère TOUTES les réservations de la base de données
        $allReservations = $resRepo->findAll();
        
        // On initialise nos compteurs à 0
        $revenus = 0;
        $countAttente = 0;
        $countConfirmee = 0;

        foreach ($allReservations as $res) {
            // SI la réservation est confirmée, on calcule l'argent gagné
            if ($res->getStatut() === 'confirmee') {
                $countConfirmee++;
                
                // On récupère le prix de la voiture et on multiplie par le nombre de jours
                $prixParJour = $res->getVoiture() ? $res->getVoiture()->getPrix() : 0;
                $diff = $res->getDateDebut()->diff($res->getDateFin());
                $nbJours = $diff->days ?: 1; // Si c'est le même jour, on compte 1 jour
                
                $revenus += ($prixParJour * $nbJours);
            }

            // SI elle est en attente, on incrémente le compteur spécifique
            if ($res->getStatut() === 'en_attente') {
                $countAttente++;
            }
        }

        // On calcule le taux de confirmation (Confirmées / Total * 100)
        $total = count($allReservations);
        $taux = ($total > 0) ? round(($countConfirmee / $total) * 100) : 0;

        // On renvoie un objet JSON propre que React pourra lire facilement
        return new JsonResponse([
            'revenus' => $revenus,
            'reservationsCeMois' => $total,
            'tauxConfirmation' => $taux,
            'enAttente' => $countAttente,
            // On compte les clients qui ont le rôle ROLE_USER (Partie de Fadma)
            'totalClients' => $userRepo->count(['roles' => 'ROLE_USER']) 
        ]);
    }
}