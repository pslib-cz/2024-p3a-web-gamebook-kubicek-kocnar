using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KubicekKocnar.Server.Data;
using KubicekKocnar.Server.Models;

namespace KubicekKocnar.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeatureParamsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FeatureParamsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/FeatureParams
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FeatureParams>>> GetFeatureParams()
        {
            return await _context.FeatureParams.ToListAsync();
        }

        // GET: api/FeatureParams/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FeatureParams>> GetFeatureParams(uint id)
        {
            var featureParams = await _context.FeatureParams.FindAsync(id);

            if (featureParams == null)
            {
                return NotFound();
            }

            return featureParams;
        }

        // PUT: api/FeatureParams/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFeatureParams(uint id, FeatureParams featureParams)
        {
            if (id != featureParams.FeatureId)
            {
                return BadRequest();
            }

            _context.Entry(featureParams).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FeatureParamsExists(id))
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

        // POST: api/FeatureParams
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<FeatureParams>> PostFeatureParams(FeatureParams featureParams)
        {
            _context.FeatureParams.Add(featureParams);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFeatureParams", new { id = featureParams.FeatureId }, featureParams);
        }

        // DELETE: api/FeatureParams/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFeatureParams(uint id)
        {
            var featureParams = await _context.FeatureParams.FindAsync(id);
            if (featureParams == null)
            {
                return NotFound();
            }

            _context.FeatureParams.Remove(featureParams);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FeatureParamsExists(uint id)
        {
            return _context.FeatureParams.Any(e => e.FeatureId == id);
        }
    }
}
