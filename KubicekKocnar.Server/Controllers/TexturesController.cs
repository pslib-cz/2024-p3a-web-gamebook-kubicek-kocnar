using KubicekKocnar.Server.Data;
using KubicekKocnar.Server.Models;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KubicekKocnar.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TexturesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TexturesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Textures
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Texture>>> GetTextures()
        {
            return await _context.Textures.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Texture>> GetTexture(uint id)
        {
            var texture = await _context.Textures.FindAsync(id);

            if (texture == null) return NotFound();

            return texture;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTexture(uint id, Texture texture)
        {
            if (id != texture.TextureId)
            {
                return BadRequest();
            }

            _context.Entry(texture).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TextureExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchTexture(uint id, [FromBody] JsonPatchDocument<Texture> patchDoc)
        {
            if (patchDoc == null)
            {
                return BadRequest();
            }
            var texture = await _context.Textures.FindAsync(id);
            if (texture == null)
            {
                return NotFound();
            }
            patchDoc.ApplyTo(texture, ModelState);
            if (!TryValidateModel(texture))
            {
                return ValidationProblem(ModelState);
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Texture>> PostTexture(string name, IFormFile file)
        {

            // check if file is an image and set it into texture.contetn
            if (file == null)
            {
                return BadRequest("File is missing");
            }

            byte[] fr = null;

            int width = 0;
            int height = 0;
            int size = 0;

            if (!file.ContentType.Contains("image")) return BadRequest("File is not an image");
            if (file.ContentType == "image/svg+xml") return BadRequest("SVG format is not supported.");

            // get width of this image 
            using (var image = System.Drawing.Image.FromStream(file.OpenReadStream()))
            {
                width = image.Width;
                height = image.Height;
                size = (int)file.Length;
            }

            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                fr = memoryStream.ToArray();
            }


            Texture texture = new Texture()
            {
                Name = name,
                Content = fr,
                Created = DateTime.Now,
                Width = width,
                Height = height,
                Size = size
            };

            _context.Textures.Add(texture);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTexture", new { id = texture.TextureId }, texture);
        }

        [HttpDelete("{id}")]
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
