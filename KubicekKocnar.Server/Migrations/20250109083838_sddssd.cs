using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KubicekKocnar.Server.Migrations
{
    /// <inheritdoc />
    public partial class sddssd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Textures_Items_ItemId",
                table: "Textures");

            migrationBuilder.AddForeignKey(
                name: "FK_Textures_Items_ItemId",
                table: "Textures",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "ItemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Textures_Items_ItemId",
                table: "Textures");

            migrationBuilder.AddForeignKey(
                name: "FK_Textures_Items_ItemId",
                table: "Textures",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "ItemId",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
