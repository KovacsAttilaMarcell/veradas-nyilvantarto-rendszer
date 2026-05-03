import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userRepository = AppDataSource.getRepository(User);

const JWT_SECRET = 'very_secret_key';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Az email és a jelszó megadása kötelező.',
      });
    }

    const existingUser = await userRepository.findOneBy({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'Ez az email cím már foglalt.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepository.create({
      email,
      password: hashedPassword,
    });

    const savedUser = await userRepository.save(user);

    res.status(201).json({
      id: savedUser.id,
      email: savedUser.email,
    });
  } catch {
    res.status(500).json({
      message: 'Hiba történt a regisztráció során.',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Az email és a jelszó megadása kötelező.',
      });
    }

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      return res.status(401).json({
        message: 'Hibás email vagy jelszó.',
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Hibás email vagy jelszó.',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch {
    res.status(500).json({
      message: 'Hiba történt a bejelentkezés során.',
    });
  }
};