// a Texture is an image that is used to texture a Block
// it can also be used as an image stored in the database for icons, background images, thumbnails, etc.

interface Texture {
  textureId: string;
  content: string;
  created: Date;
  type: string;
}

export default Texture;