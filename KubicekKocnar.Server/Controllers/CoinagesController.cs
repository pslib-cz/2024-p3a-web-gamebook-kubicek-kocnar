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
    public class CoinagesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CoinagesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Coinages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Coinage>>> GetCoinages()
        {
            return await _context.Coinages.ToListAsync();
        }

        // GET: api/Coinages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Coinage>> GetCoinage(uint id)
        {
            var coinage = await _context.Coinages.FindAsync(id);

            if (coinage == null)
            {
                return NotFound();
            }

            return coinage;
        }

        // PUT: api/Coinages/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCoinage(uint id, Coinage coinage)
        {
            if (id != coinage.CoinageId)
            {
                return BadRequest();
            }

            _context.Entry(coinage).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CoinageExists(id))
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

        // POST: api/Coinages
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Coinage>> PostCoinage(Coinage coinage)
        {
            _context.Coinages.Add(coinage);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCoinage", new { id = coinage.CoinageId }, coinage);
        }

        // DELETE: api/Coinages/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCoinage(uint id)
        {
            var coinage = await _context.Coinages.FindAsync(id);
            if (coinage == null)
            {
                return NotFound();
            }

            _context.Coinages.Remove(coinage);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CoinageExists(uint id)
        {
            return _context.Coinages.Any(e => e.CoinageId == id);
        }
    }
}
