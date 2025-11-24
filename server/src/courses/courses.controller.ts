import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CourseCreateDto, CourseFindDTO, PartialCourseFindDTO } from './dto/course.create.dto';

@Controller('courses')
export class CoursesController {
    constructor(private readonly courseService:CoursesService){}


    @Post('create-course')
    async createCourse(@Body() body:CourseCreateDto){
        return this.courseService.create(body)
    }
    @Get(":courseId")
    async findCourseById(@Param() courseId:CourseFindDTO){
        return this.courseService.findCourse(courseId)
    }
    @Get(":name")
    async findCourseByName(@Param() body:PartialCourseFindDTO){
        return this.courseService.findCourseByName(body)
    }
    @Delete(":id")
    async deleteCourseById(@Param() id:string){
        return this.courseService.delete(id)
    }

}
