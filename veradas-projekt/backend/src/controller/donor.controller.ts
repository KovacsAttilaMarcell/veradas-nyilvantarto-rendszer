import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Donor } from '../entity/Donor';
import { isValidTaj } from '../util/taj-validator';

const donorRepository = AppDataSource.getRepository(Donor);

export const getAllDonors = async (_req: Request, res: Response) => {
  try {
    const donors = await donorRepository.find({
      order: { id: 'ASC' },
    });

    res.json(donors);
  } catch {
    res.status(500).json({ message: 'Hiba történt a lekérdezés során.' });
  }
};

export const createDonor = async (req: Request, res: Response) => {
  try {
    const {
      name,
      gender,
      citizenship,
      birthPlace,
      birthDate,
      address,
      tajNumber,
    } = req.body;

    if (
      !name ||
      !gender ||
      !citizenship ||
      !birthPlace ||
      !birthDate ||
      !address ||
      !tajNumber
    ) {
      return res.status(400).json({
        message: 'Minden mező kitöltése kötelező.',
      });
    }

    // TAJ VALIDÁCIÓ
    if (!isValidTaj(tajNumber)) {
      return res.status(400).json({
        message: 'Érvénytelen TAJ szám.',
      });
    }

    const donor = donorRepository.create({
      name,
      gender,
      citizenship,
      birthPlace,
      birthDate,
      address,
      tajNumber,
    });

    const saved = await donorRepository.save(donor);

    res.status(201).json(saved);
  } catch {
    res.status(500).json({ message: 'Hiba történt a mentés során.' });
  }
};