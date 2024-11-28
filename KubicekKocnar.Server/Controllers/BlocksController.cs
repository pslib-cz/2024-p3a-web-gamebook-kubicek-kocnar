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
    public class BlocksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BlocksController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Blocks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Block>>> GetBlocks()
        {
            return await _context.Blocks.ToListAsync();
        }

        // GET: api/Blocks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Block>> GetBlock(uint id)
        {
            var block = await _context.Blocks.FindAsync(id);

            if (block == null)
            {
                return NotFound();
            }

            return block;
        }

        // PUT: api/Blocks/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBlock(uint id, Block block)
        {
            if (id != block.BlockId)
            {
                return BadRequest();
            }

            _context.Entry(block).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BlockExists(id))
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

        // PATCH: api/Blocks/5 using JsonPatchDocument
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchBlock(uint id, [FromBody] JsonPatchDocument<Block> patch) {
            var block = await _context.Blocks.FindAsync(id);
            if (block == null) {
                return NotFound();
            }
            patch.ApplyTo(block, ModelState);
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }


        // POST: api/Blocks
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Block>> PostBlock(Block block)
        {
            _context.Blocks.Add(block);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBlock", new { id = block.BlockId }, block);
        }

        // DELETE: api/Blocks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlock(uint id)
        {
            var block = await _context.Blocks.FindAsync(id);
            if (block == null)
            {
                return NotFound();
            }

            _context.Blocks.Remove(block);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BlockExists(uint id)
        {
            return _context.Blocks.Any(e => e.BlockId == id);
        }
    }
}
