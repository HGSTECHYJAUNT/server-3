import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVideoDto } from './dto/create-video.dto';

@Injectable()
export class VideoService {
    private readonly logger = new Logger(VideoService.name)
  constructor(private readonly db: PrismaService) {}
  async create(data: CreateVideoDto) {
    try {
      const video = await this.db.video.create({
        data,
      });
      this.logger.log(video)
      if (!video) {
        this.logger.debug(video)
      }

      return {
        success: true,
        data: {
          message: 'Video created Successfully',
          video,
        },
      };
    } catch (err) {
      if (err instanceof HttpException) {
        return this.logger.error(err);
      } else {
        return new InternalServerErrorException('Something went wrong',err);
      }
    }
  }
  async findById(id: string) {
 
    try{
           const video = await this.db.video.findFirst({
        where:{id}
    })
    if(!video){
        throw new NotFoundException(`Video with the id ${id} was not found`)
    }
    return {
        message:"Video retrieved successfully",
        video
    }

    }catch(err){
        if(err instanceof HttpException){
            return err
        }else{
            return new InternalServerErrorException("Something went wrong",err)
        }
    }
  }
  async delete(id:string){
    await this.db.video.delete({
        where:{id}
    })
    return {
        message:"Video deleted successfully"
    }
  }
}
