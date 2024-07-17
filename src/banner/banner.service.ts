import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Banner } from 'src/entities/banner.entity';
import { User } from 'src/entities/user.entity';
import { BannerDto } from './dto/banner.dto';
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
  ) { }

  async create(createBannerDto: BannerDto, userId: string, imgSrc: string): Promise<Banner> {
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

  async findOne(id: string): Promise<Banner | undefined> {
    return this.bannerRepository.findOne({ where: { id } });
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
    const banners = await this.bannerRepository.find({ order: { order: 'ASC' } }); 
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

  async updateBannerOrder(bannerId: string, newOrder: number): Promise<void> {
    const banner = await this.bannerRepository.findOne({ where: { id: bannerId } });
    if (!banner) {
      throw new NotFoundException(`Banner with id ${bannerId} not found`);
    }

    banner.order = newOrder;
    await this.bannerRepository.save(banner);
  }

  async reorderBanners(banners: { id: string, order: number }[]): Promise<void> {
    const updatePromises = banners.map(async (banner, index) => {
      const foundBanner = await this.bannerRepository.findOne({ where: { id: banner.id } });
      if (!foundBanner) {
        throw new NotFoundException(`Banner with id ${banner.id} not found`);
      }
      foundBanner.order = index + 1;
      await this.bannerRepository.save(foundBanner);
    });

    await Promise.all(updatePromises);
    await this.clearAllBannerCache();
  }

  private async clearAllBannerCache() {
    const keys = await redis.keys('banners_*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}