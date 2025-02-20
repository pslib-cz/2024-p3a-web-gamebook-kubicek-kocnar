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
using Microsoft.AspNetCore.Authorization;

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
            return await _context.Blocks
                .Include(t => t.Texture0)
                .Include(t => t.Texture1)
                .Include(t => t.Texture2)
                .Include(t => t.Texture3)
                .Include(t => t.Texture4)
                .Include(t => t.Texture5)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Block>> GetBlock(uint id)
        {
            var block = await _context.Blocks.FindAsync(id);

            if (block == null)
                return NotFound();

            return block;
        }

        // PATCH: api/Blocks/5 using JsonPatchDocument
        [HttpPatch("{id}")]
        [Authorize]
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


        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Block>> PostBlock(Block block)
        {
            _context.Blocks.Add(block);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBlock", new { id = block.BlockId }, block);
        }

        [HttpDelete("{id}")]
        [Authorize]
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
