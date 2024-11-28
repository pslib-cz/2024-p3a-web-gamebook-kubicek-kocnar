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
    public class PlacedBlocksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PlacedBlocksController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/PlacedBlocks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlacedBlock>>> GetPlacedBlocks()
        {
            return await _context.PlacedBlocks.ToListAsync();
        }

        // GET: api/PlacedBlocks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PlacedBlock>> GetPlacedBlock(uint id)
        {
            var placedBlock = await _context.PlacedBlocks.FindAsync(id);

            if (placedBlock == null)
            {
                return NotFound();
            }

            return placedBlock;
        }

        // PUT: api/PlacedBlocks/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPlacedBlock(uint id, PlacedBlock placedBlock)
        {
            if (id != placedBlock.PlacedBlockId)
            {
                return BadRequest();
            }

            _context.Entry(placedBlock).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PlacedBlockExists(id))
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

        // PATCH api/PlacedBlocks/5 using JsonPatchDocument
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchPlacedBlock(uint id, JsonPatchDocument<PlacedBlock> patchDoc) {
            if (patchDoc == null) {
                return BadRequest();
            }
            var placedBlock = await _context.PlacedBlocks.FindAsync(id);
            if (placedBlock == null) {
                return NotFound();
            }
            patchDoc.ApplyTo(placedBlock, ModelState);
            if (!TryValidateModel(placedBlock)) {
                return ValidationProblem(ModelState);
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/PlacedBlocks
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PlacedBlock>> PostPlacedBlock(PlacedBlock placedBlock)
        {
            _context.PlacedBlocks.Add(placedBlock);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPlacedBlock", new { id = placedBlock.PlacedBlockId }, placedBlock);
        }

        // DELETE: api/PlacedBlocks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlacedBlock(uint id)
        {
            var placedBlock = await _context.PlacedBlocks.FindAsync(id);
            if (placedBlock == null)
            {
                return NotFound();
            }

            _context.PlacedBlocks.Remove(placedBlock);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PlacedBlockExists(uint id)
        {
            return _context.PlacedBlocks.Any(e => e.PlacedBlockId == id);
        }
    }
}
