<?php

// ============================================================================
// FICHIER : src/Controller/Api/ReservationController.php
// RÔLE : Gère toutes les opérations liées aux réservations (CRUD + Logique métier)
// ============================================================================

namespace App\Controller\Api;

// --- IMPORTS DES CLASSES NÉCESSAIRES ---
use App\Entity\Reservation;
use App\Entity\Voiture;
use App\Entity\Utilisateur;
use App\Service\ReservationService;
use App\Repository\ReservationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

// ============================================================================
// DÉFINITION DU CONTRÔLEUR
// ============================================================================

#[Route('/api/reservation')]
class ReservationController extends AbstractController
{
    // --- CONSTRUCTEUR ---

    public function __construct(
        private EntityManagerInterface $entityManager,
        private ReservationRepository $reservationRepository,
        private ReservationService $reservationService
    ) {}

    // ==========================================================================
    // ENDPOINT 1 : GET /api/reservation/admin/reservations (ADMIN)
    // ==========================================================================

    #[Route('/admin/reservations', name: 'api_admin_reservations_list', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getAllReservations(): JsonResponse
    {
        $reservations = $this->reservationRepository->findAll();
        $data = [];

        foreach ($reservations as $reservation) {
            $data[] = [
                'id' => $reservation->getId(),
                'dateDebut' => $reservation->getDateDebut()?->format('Y-m-d H:i:s'),
                'dateFin' => $reservation->getDateFin()?->format('Y-m-d H:i:s'),
                'statut' => $reservation->getStatut(),
                'prixTotal' => $reservation->getPrixTotal(),
                'client_email' => $reservation->getUtilisateur()?->getEmail(),
                'client_nom' => $reservation->getUtilisateur()?->getNom(),
                'voiture_id' => $reservation->getVoiture()?->getId(),
                'voiture_modele' => $reservation->getVoiture()?->getModele(),
            ];
        }

        return new JsonResponse($data, Response::HTTP_OK);
    }

    // ==========================================================================
    // ENDPOINT 2 : PUT /api/reservation/admin/reservations/{id}/confirm (ADMIN)
    // ==========================================================================

    #[Route('/admin/reservations/{id}/confirm', name: 'api_admin_reservation_confirm', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function confirmReservation(int $id): JsonResponse
    {
        $reservation = $this->reservationRepository->find($id);

        if (!$reservation) {
            return new JsonResponse(['error' => 'Réservation introuvable'], Response::HTTP_NOT_FOUND);
        }

        $reservation->setStatut('confirmee');
        $this->entityManager->flush();

        return new JsonResponse([
            'success' => true,
            'message' => 'Réservation confirmée avec succès',
            'nouveau_statut' => $reservation->getStatut()
        ], Response::HTTP_OK);
    }

    // ==========================================================================
    // ENDPOINT 3 : PUT /api/reservation/admin/reservations/{id}/cancel (ADMIN)
    // ==========================================================================

    #[Route('/admin/reservations/{id}/cancel', name: 'api_admin_reservation_cancel', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function cancelReservation(int $id): JsonResponse
    {
        $reservation = $this->reservationRepository->find($id);

        if (!$reservation) {
            return new JsonResponse(['error' => 'Réservation introuvable'], Response::HTTP_NOT_FOUND);
        }

        $reservation->setStatut('annulee');
        $this->entityManager->flush();

        return new JsonResponse([
            'success' => true,
            'message' => 'Réservation annulée',
            'nouveau_statut' => $reservation->getStatut()
        ], Response::HTTP_OK);
    }

    // ==========================================================================
    // ENDPOINT 4 : GET /api/reservation/my (CLIENT)
    // ==========================================================================

    #[Route('/my', name: 'api_reservation_my', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function getMyReservations(): JsonResponse
    {
        /** @var \App\Entity\Utilisateur $user */
        $user = $this->getUser();
        $toutesLesResas = $this->reservationRepository->findAll();
        $mesResas = [];

        foreach ($toutesLesResas as $resa) {
            if ($resa->getUtilisateur() && $resa->getUtilisateur()->getId() === $user->getId()) {
                $mesResas[] = [
                    'id' => $resa->getId(),
                    'dateDebut' => $resa->getDateDebut()?->format('Y-m-d'),
                    'dateFin' => $resa->getDateFin()?->format('Y-m-d'),
                    'statut' => $resa->getStatut(),
                    'prixTotal' => $resa->getPrixTotal(),
                    'voiture' => [
                        'id' => $resa->getVoiture()?->getId(),
                        'marque' => $resa->getVoiture()?->getMarque(),
                        'modele' => $resa->getVoiture()?->getModele(),
                        'image' => $resa->getVoiture()?->getImage(),
                    ]
                ];
            }
        }

        return new JsonResponse($mesResas, Response::HTTP_OK);
    }

    // ==========================================================================
    // ENDPOINT 5 : POST /api/reservation/ (CRÉATION)
    // ==========================================================================

    #[Route('', name: 'api_reservation_create', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function createReservation(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return new JsonResponse(['error' => 'JSON invalide'], Response::HTTP_BAD_REQUEST);
        }

        if (!isset($data['dateDebut'], $data['dateFin'], $data['voiture_id'])) {
            return new JsonResponse(['error' => 'Données incomplètes'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $dateDebut = new \DateTime($data['dateDebut']);
            $dateFin = new \DateTime($data['dateFin']);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Format de date incorrect'], Response::HTTP_BAD_REQUEST);
        }

        if ($dateFin <= $dateDebut) {
            return new JsonResponse(['error' => 'La date de fin doit être après le début'], Response::HTTP_BAD_REQUEST);
        }

        $voiture = $this->entityManager->getRepository(Voiture::class)->find($data['voiture_id']);
        if (!$voiture) {
            return new JsonResponse(['error' => 'Voiture introuvable'], Response::HTTP_NOT_FOUND);
        }

        if (!$this->reservationService->isAvailable($voiture->getId(), $dateDebut, $dateFin)) {
            return new JsonResponse([
                'error' => 'Ce véhicule n\'est pas disponible sur cette période.'
            ], Response::HTTP_CONFLICT);
        }

        $interval = $dateDebut->diff($dateFin);
        $nbJours = $interval->days;
        if ($nbJours === 0) $nbJours = 1;

        $prixTotal = $nbJours * $voiture->getPrixJour();

        $userConnecte = $this->getUser();

        if (!$userConnecte) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $idUtilisateur = $userConnecte->getId();

        /** @var \App\Entity\Utilisateur $utilisateur */
        $utilisateur = $this->entityManager->getRepository(Utilisateur::class)->find($idUtilisateur);

        if (!$utilisateur) {
            return new JsonResponse(['error' => 'Erreur système: Utilisateur introuvable en base'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $reservation = new Reservation();
        $reservation->setDateDebut($dateDebut);
        $reservation->setDateFin($dateFin);
        $reservation->setStatut('en_attente');
        $reservation->setPrixTotal($prixTotal);
        $reservation->setVoiture($voiture);
        $reservation->setUtilisateur($utilisateur);

        try {
            $this->entityManager->persist($reservation);
            $this->entityManager->flush();

            return new JsonResponse([
                'success' => true,
                'message' => 'Votre demande de réservation a été envoyée avec succès !',
                'data' => [
                    'id' => $reservation->getId(),
                    'prixTotal' => $reservation->getPrixTotal(),
                    'statut' => $reservation->getStatut(),
                    'nbJours' => $nbJours
                ]
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Erreur lors de l\'enregistrement',
                'details' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // ==========================================================================
    // ENDPOINT 6 : PUT /api/reservation/{id}/cancel (CLIENT - annuler sa propre réservation)
    // ==========================================================================

    #[Route('/{id}/cancel', name: 'api_reservation_cancel', methods: ['PUT'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function cancelMyReservation(int $id): JsonResponse
    {
        /** @var \App\Entity\Utilisateur $user */
        $user = $this->getUser();

        $reservation = $this->reservationRepository->find($id);

        if (!$reservation) {
            return new JsonResponse(['error' => 'Réservation introuvable'], Response::HTTP_NOT_FOUND);
        }

        // Vérifier que la réservation appartient bien à l'utilisateur connecté
        if ($reservation->getUtilisateur()?->getId() !== $user->getId()) {
            return new JsonResponse(['error' => 'Accès refusé'], Response::HTTP_FORBIDDEN);
        }

        // On ne peut pas annuler une réservation déjà annulée
        if ($reservation->getStatut() === 'annulee') {
            return new JsonResponse(['error' => 'Cette réservation est déjà annulée'], Response::HTTP_BAD_REQUEST);
        }

        $reservation->setStatut('annulee');
        $this->entityManager->flush();

        return new JsonResponse([
            'success' => true,
            'message' => 'Réservation annulée avec succès',
            'nouveau_statut' => $reservation->getStatut()
        ], Response::HTTP_OK);
    }
}