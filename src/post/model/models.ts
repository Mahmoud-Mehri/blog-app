export class Post {
  constructor(
    public id: string,
    public title: string,
    public content: string,
    public imageUrl: string,
    public userId: string,
  ) {}
}