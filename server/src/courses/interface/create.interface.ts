 export interface IVideo{
     id: string 
  name :string  
  video: string 
  description :string
  duration:string 
  courseId :string 
  userId :string
  comment : IComment[]
 }
 export interface IComment {
    id:string  
  text:string
  userId:string
  videoId:string
 }

