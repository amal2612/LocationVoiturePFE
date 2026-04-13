<?php

namespace App\Repository;

use App\Entity\Reservation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Reservation>
 */
class ReservationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Reservation::class);
    }

    //    /**
    //     * @return Reservation[] Returns an array of Reservation objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('r')
    //            ->andWhere('r.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('r.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Reservation
    //    {
    //        return $this->createQueryBuilder('r')
    //            ->andWhere('r.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
        // ============================================================================
  // ============================================================================
// MÉTHODE : checkConflict()
// Trouve les réservations qui chevauchent une période donnée pour une voiture
// ============================================================================

public function checkConflict(int $voitureId, \DateTime $dateDebut, \DateTime $dateFin): array
{
    return $this->createQueryBuilder('r')
        // 1 Filtrer par voiture
        ->andWhere('r.voiture = :voitureId')
        ->setParameter('voitureId', $voitureId)
        
        // 2 Ignorer les réservations annulées
        ->andWhere('r.statut != :statutAnnulee')
        ->setParameter('statutAnnulee', 'annulee')
        
        // 3 LOGIQUE DE CHEVAUCHEMENT (CORRIGÉE ) :
        // Deux périodes se chevauchent si :
        // (début_existant <= fin_nouveau) ET (fin_existant >= début_nouveau)
        ->andWhere('r.dateDebut <= :dateFin')
        ->andWhere('r.dateFin >= :dateDebut')
        ->setParameter('dateDebut', $dateDebut)
        ->setParameter('dateFin', $dateFin)
        
        // 4 Exécuter et retourner les résultats
        ->getQuery()
        ->getResult();
}
}
