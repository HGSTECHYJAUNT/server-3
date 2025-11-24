import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';

@Controller('video')
export class VideoController {
    constructor(private readonly videoService:VideoService){}
    @Post('create')
    async create (@Body() body:CreateVideoDto){
        return await this.videoService.create(body)
    }
    @Get(":id")
    async findById(@Param() id:string){
        return await this.videoService.findById(id)
    }
    @Delete(":id")
    async deleteById(@Param() id:string){
        return await this.videoService.delete(id)
    }
}
