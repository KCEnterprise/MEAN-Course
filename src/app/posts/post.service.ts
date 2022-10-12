import { Injectable } from '@angular/core';
import{Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';

import{Post} from './post.model';
import { Router } from "@angular/router";

@Injectable({providedIn:'root'})
export class PostsService{
  private posts:Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient, private router:Router){}


  getPosts(){
    this.httpClient
    .get<{message: string, posts: any }>('http://localhost:3000/api/posts')
    .pipe(map((postData) =>{
      return postData.posts.map((post: { title: any; content: any; _id: any; creator:any; }) => {
        return {
        title :post.title,
        content: post.content,
        id : post._id,
        creator:post.creator
        };
      });
    }))
    .subscribe((transformedPosts)=>{
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);

    });
    //return this.posts;
  }

  getPostsUpdatelistener(){
    return this.postsUpdated.asObservable();
  }

  getPost(id:string){
    return this.httpClient.get<{_id: string, title:string, content:string, creator:string}>('http://localhost:3000/api/posts/' +id);
    // return{...this.posts.find(p => p.id ===id)};
  }


  addPost(title:string, content:string){
    const post: Post = {id:'null' , title:title, content: content, creator: null};
    this.httpClient.post<{message:string, postId:string}>('http://localhost:3000/api/posts', post)
    .subscribe((responseData)=>{
      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts])
      this.router.navigate(["/"]);
    });
  }

  updatePost (id:string, title:string, content:string)
  {
    const post: Post={ id: id, title:title, content:content, creator: null};
    this.httpClient
    .put("http://localhost:3000/api/posts/" +id,post)
    .subscribe(response =>
      {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId:String){
    this.httpClient.delete("http://localhost:3000/api/posts/" + postId)
    .subscribe(
      ()=> {
        console.log('Post Deleted');
        const updatedPosts = this.posts.filter(post => post.id !== postId );
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      }
    )
  }

}


