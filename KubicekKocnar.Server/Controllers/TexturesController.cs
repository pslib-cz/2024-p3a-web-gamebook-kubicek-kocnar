using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KubicekKocnar.Server.Data;
using KubicekKocnar.Server.Models;
using Microsoft.AspNetCore.JsonPatch;

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
        public async Task<IActionResult> PatchTexture(uint id, [FromBody] JsonPatchDocument<Texture> patchDoc) {
            if (patchDoc == null) {
                return BadRequest();
            }
            var texture = await _context.Textures.FindAsync(id);
            if (texture == null) {
                return NotFound();
            }
            patchDoc.ApplyTo(texture, ModelState);
            if (!TryValidateModel(texture)) {
                return ValidationProblem(ModelState);
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Texture>> PostTexture(Texture texture)
        {
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
