import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Location } from '../entity/Location';

const locationRepository = AppDataSource.getRepository(Location);

export const getAllLocations = async (_req: Request, res: Response) => {
  try {
    const locations = await locationRepository.find({
      order: {
        id: 'ASC',
      },
    });

    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Hiba történt a helyszínek lekérdezése közben.' });
  }
};

export const createLocation = async (req: Request, res: Response) => {
  try {
    const { institutionName, address } = req.body;

    if (!institutionName || !address) {
      return res.status(400).json({
        message: 'Az intézmény neve és a cím megadása kötelező.',
      });
    }

    const location = locationRepository.create({
      institutionName,
      address,
      active: true,
    });

    const savedLocation = await locationRepository.save(location);

    res.status(201).json(savedLocation);
  } catch (error) {
    res.status(500).json({ message: 'Hiba történt a helyszín létrehozása közben.' });
  }
};

export const activateLocation = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const location = await locationRepository.findOneBy({ id });

    if (!location) {
      return res.status(404).json({ message: 'A helyszín nem található.' });
    }

    location.active = true;
    const updatedLocation = await locationRepository.save(location);

    res.json(updatedLocation);
  } catch (error) {
    res.status(500).json({ message: 'Hiba történt a helyszín aktiválása közben.' });
  }
};

export const deactivateLocation = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const location = await locationRepository.findOneBy({ id });

    if (!location) {
      return res.status(404).json({ message: 'A helyszín nem található.' });
    }

    location.active = false;
    const updatedLocation = await locationRepository.save(location);

    res.json(updatedLocation);
  } catch (error) {
    res.status(500).json({ message: 'Hiba történt a helyszín inaktiválása közben.' });
  }
};