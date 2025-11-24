import { IsOptional, IsString } from "class-validator";
import { string } from "zod";

export class CreateVideoDto{
    @IsString()
    name:string
    @IsString()
    description:string
    @IsString()
    video:string
    @IsString()
    duration:string
    @IsString()
    @IsOptional()
    courseId:string
    @IsString()
    userId:string
}