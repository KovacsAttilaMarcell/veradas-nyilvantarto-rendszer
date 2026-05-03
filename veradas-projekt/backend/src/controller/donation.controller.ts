import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Donation } from '../entity/Donation';
import { Donor } from '../entity/Donor';
import { Location } from '../entity/Location';
import { isValidTaj } from '../util/taj-validator';

const donationRepository = AppDataSource.getRepository(Donation);
const donorRepository = AppDataSource.getRepository(Donor);
const locationRepository = AppDataSource.getRepository(Location);

export const getAllDonations = async (req: Request, res: Response) => {
  try {
    const { locationId, donorId, startDate, endDate } = req.query;

    const query = donationRepository
      .createQueryBuilder('donation')
      .leftJoinAndSelect('donation.location', 'location')
      .leftJoinAndSelect('donation.donor', 'donor');

    // csak sikeres véradások
    query.where('donation.eligible = :eligible', { eligible: true });

    // szűrés helyszín szerint
    if (locationId) {
      query.andWhere('location.id = :locationId', {
        locationId: Number(locationId),
      });
    }

    // szűrés donor szerint
    if (donorId) {
      query.andWhere('donor.id = :donorId', {
        donorId: Number(donorId),
      });
    }

    // dátum intervallum
    if (startDate) {
      query.andWhere('donation.donationDate >= :startDate', {
        startDate,
      });
    }

    if (endDate) {
      query.andWhere('donation.donationDate <= :endDate', {
        endDate,
      });
    }

    const donations = await query.getMany();

    res.json(donations);
  } catch {
    res.status(500).json({
      message: 'Hiba történt a szűrés során.',
    });
  }
};

export const createDonation = async (req: Request, res: Response) => {
  try {
    const {
      locationId,
      donorId,
      donationDate,
      eligible,
      ineligibleReason,
      doctorName,
      directed,
      patientName,
      patientTajNumber,
    } = req.body;

    if (
      !locationId ||
      !donorId ||
      !donationDate ||
      eligible === undefined ||
      !doctorName ||
      directed === undefined
    ) {
      return res.status(400).json({
        message: 'A kötelező mezők hiányoznak.',
      });
    }

    const location = await locationRepository.findOneBy({ id: Number(locationId) });
    if (!location) {
      return res.status(404).json({ message: 'A helyszín nem található.' });
    }

    if (!location.active) {
      return res.status(400).json({
        message: 'Inaktív helyszínen nem rögzíthető új véradás.',
      });
    }

    const donor = await donorRepository.findOneBy({ id: Number(donorId) });
    if (!donor) {
      return res.status(404).json({ message: 'A véradó nem található.' });
    }

    if (eligible === false) {
      if (!ineligibleReason) {
        return res.status(400).json({
          message: 'Ha a jelölt nem alkalmas, az ok megadása kötelező.',
        });
      }

      if (directed === true) {
        return res.status(400).json({
          message: 'Nem alkalmas jelölt esetén nem lehet irányított véradás.',
        });
      }
    }

    if (directed === true) {
      if (eligible !== true) {
        return res.status(400).json({
          message: 'Irányított véradás csak alkalmas jelölt esetén történhet.',
        });
      }

      if (!patientName || !patientTajNumber) {
        return res.status(400).json({
          message: 'Irányított véradás esetén a beteg neve és TAJ száma kötelező.',
        });
      }

      if (!isValidTaj(patientTajNumber)) {
        return res.status(400).json({
          message: 'A beteg TAJ száma érvénytelen.',
        });
      }
    }

    const donation = donationRepository.create({
      location,
      donor,
      donationDate,
      eligible,
      ineligibleReason: eligible ? null : ineligibleReason,
      doctorName,
      directed,
      patientName: directed ? patientName : null,
      patientTajNumber: directed ? patientTajNumber : null,
    });

    const savedDonation = await donationRepository.save(donation);

    const result = await donationRepository.findOne({
      where: { id: savedDonation.id },
      relations: ['location', 'donor'],
    });

    res.status(201).json(result);
  } catch {
    res.status(500).json({ message: 'Hiba történt a véradás rögzítése közben.' });
  }
};