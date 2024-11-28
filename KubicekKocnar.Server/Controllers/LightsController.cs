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
    public class LightsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LightsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Lights
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Light>>> GetLights()
        {
            return await _context.Lights.ToListAsync();
        }

        // GET: api/Lights/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Light>> GetLight(int id)
        {
            var light = await _context.Lights.FindAsync(id);

            if (light == null)
            {
                return NotFound();
            }

            return light;
        }

        // PUT: api/Lights/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLight(int id, Light light)
        {
            if (id != light.LightId)
            {
                return BadRequest();
            }

            _context.Entry(light).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LightExists(id))
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

        // POST: api/Lights
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Light>> PostLight(Light light)
        {
            _context.Lights.Add(light);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLight", new { id = light.LightId }, light);
        }

        // PATCH : api/Lights/5 using JsonPatchDocument
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchLight(int id, [FromBody] JsonPatchDocument<Light> patchDoc) {
            if (patchDoc == null) {
                return BadRequest();
            }
            var light = await _context.Lights.FindAsync(id);
            if (light == null) {
                return NotFound();
            }
            patchDoc.ApplyTo(light, ModelState);
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Lights/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLight(int id)
        {
            var light = await _context.Lights.FindAsync(id);
            if (light == null)
            {
                return NotFound();
            }

            _context.Lights.Remove(light);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LightExists(int id)
        {
            return _context.Lights.Any(e => e.LightId == id);
        }
    }
}
