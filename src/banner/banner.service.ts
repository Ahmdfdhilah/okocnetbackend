import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Banner } from 'src/entities/banner.entity';
import { User } from 'src/entities/user.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import redis from 'src/lib/redis-client';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class BannerService {
  private readonly logger = new Logger(BannerService.name);

  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createBannerDto: CreateBannerDto, userId: string, imgSrc: string): Promise<Banner> {
    let newBanner: Banner;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }

      const createdBy = user;
      const updatedBy = user;
      const dataBanner = { ...createBannerDto, createdBy, updatedBy, foto: imgSrc };

      newBanner = await transactionalEntityManager.save(
        this.bannerRepository.create(dataBanner),
      );
    });

    await this.clearAllBannerCache();
    return newBanner!;
  }

  async update(
    id: string,
    userId: string,
    updateBannerDto: UpdateBannerDto,
    imgSrc?: string,
  ): Promise<Banner> {
    let updatedBanner: Banner;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }

      const banner = await transactionalEntityManager.findOne(Banner, { where: { id } });
      if (!banner) {
        throw new NotFoundException(`Banner with id ${id} not found`);
      }

      const updatedBy = user;
      const updatedData = {
        ...banner,
        ...updateBannerDto,
        updatedBy: updatedBy,
        foto: imgSrc || banner.foto,
      };

      if (imgSrc && banner.foto) {
        const oldImagePath = path.join(__dirname, '../../public/upload/banners', path.basename(banner.foto));
        if (oldImagePath) {
          fs.unlinkSync(oldImagePath);
        }
      }

      Object.assign(banner, updatedData);
      updatedBanner = await transactionalEntityManager.save(banner);
    });

    await this.clearAllBannerCache();
    return updatedBanner!;
  }

  async findOne(id: string): Promise<Banner | undefined> {
    return this.bannerRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
  }

  async findAll(): Promise<Banner[]> {
    const cacheKey = 'banners_all';
    this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);

    const cachedData = await redis.get<string | null>(cacheKey);
    if (cachedData) {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
      const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
      return result;
    }

    this.logger.log(`Fetching from DB`);
    const banners = await this.bannerRepository.find({ relations: ['createdBy', 'updatedBy'] });
    this.logger.log(`DB result - Banners count: ${banners.length}`);

    await redis.set(cacheKey, JSON.stringify(banners), { ex: 3600 });
    return banners;
  }

  async remove(id: string): Promise<void> {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException(`Banner with id ${id} not found`);
    }

    if (banner.foto) {
      const imagePath = path.join(__dirname, '../../public/upload/banners', path.basename(banner.foto));
      fs.unlinkSync(imagePath);
    }

    await this.bannerRepository.delete(id);
    await this.clearAllBannerCache();
  }

  private async clearAllBannerCache() {
    const keys = await redis.keys('banners_*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}