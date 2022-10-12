import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import {Post} from '../post.model';
import { PostsService } from "../post.service";


@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy{

  posts: Post[]  = [];

  userIsAuthenticated = true;
  userId:string;
  postsSub!: Subscription;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService,
    private authService:AuthService){}

  ngOnInit(){
    this.postsService.getPosts();
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostsUpdatelistener()
    .subscribe((posts: Post[])=> {
        this.posts = posts;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe( isAthenticated =>{
      this.userIsAuthenticated = isAthenticated;
      this.userId = this.authService.getUserId()
    });
  }

  onDelete(postId:String){
    this.postsService.deletePost(postId);
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
