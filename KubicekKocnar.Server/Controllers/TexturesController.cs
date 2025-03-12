using KubicekKocnar.Server.Data;
using KubicekKocnar.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Any;
using Mono.TextTemplating;
using System.Linq;

namespace KubicekKocnar.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TexturesController : ControllerBase {
        private readonly AppDbContext _context;

        public TexturesController(AppDbContext context) {
            _context = context;
        }

        // GET: api/Textures
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Texture>>> GetTextures() {
            return await _context.Textures.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Texture>> GetTexture(uint id) {
            var texture = await _context.Textures.FindAsync(id);

            if (texture == null) return NotFound();

            return texture;
        }

        [HttpGet("{id}/image")]
        public async Task<ActionResult<Texture>> GetTextureImage(uint id) {
            var texture = await _context.Textures.FindAsync(id);

            if (texture == null) return NotFound();

            if (texture.Type == string.Empty) return StatusCode(500, "Texture type is empty for some reason -_-");

            return File(texture.Content, texture.Type, true);
        }

        [HttpPatch("{id}")]
        [Authorize]
        public async Task<IActionResult> PatchTexture(uint id, [FromBody] JsonPatchDocument<Texture> patchDoc) {
            if (patchDoc == null)
                return BadRequest();

            var texture = await _context.Textures.FindAsync(id);
            if (texture == null)
                return NotFound();

            patchDoc.ApplyTo(texture, ModelState);
            if (!TryValidateModel(texture))
                return ValidationProblem(ModelState);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Texture>> PostTexture(string name, uint state, IFormFile file) {
            // check if file is an image and set it into texture.content
            if (file == null) {
                return BadRequest("File is missing");
            }

            byte[] fr;

            int width = 0;
            int height = 0;
            int size = 0;

            string contentType = file.ContentType;

            if (!file.ContentType.Contains("image")) return BadRequest("File is not an image");
            if (file.ContentType == "image/svg+xml") return BadRequest("SVG format is not supported.");

            // get width of this image 
            /*
            using (var image = System.Drawing.Image.FromStream(file.OpenReadStream())) {
                width = image.Width;
                height = image.Height;
                size = (int)file.Length;
            }
            */

            using (var memoryStream = new MemoryStream()) {
                await file.CopyToAsync(memoryStream);
                fr = memoryStream.ToArray();
            }

            Texture texture = new Texture() {
                Name = name,
                Type = contentType,
                Content = fr,
                Created = DateTime.Now,
                Width = width,
                Height = height,
                Size = size,
                State = state
            };

            _context.Textures.Add(texture);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTexture", new { id = texture.TextureId }, texture);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteTexture(uint id)
        {
            var texture = await _context.Textures.FindAsync(id);
            if (texture == null)
            {
                return NotFound();
            }

            _context.Textures.Remove(texture);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TextureExists(uint id)
        {
            return _context.Textures.Any(e => e.TextureId == id);
        }
    }
}
