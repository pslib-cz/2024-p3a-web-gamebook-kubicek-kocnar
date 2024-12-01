using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KubicekKocnar.Server.Migrations
{
    /// <inheritdoc />
    public partial class datetime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "src",
                table: "Textures",
                newName: "Content");

            migrationBuilder.AddColumn<DateTime>(
                name: "Created",
                table: "Textures",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "Height",
                table: "Textures",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Textures",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Size",
                table: "Textures",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Width",
                table: "Textures",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "Created",
                table: "Blocks",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_Blocks_Texture0Id",
                table: "Blocks",
                column: "Texture0Id");

            migrationBuilder.CreateIndex(
                name: "IX_Blocks_Texture1Id",
                table: "Blocks",
                column: "Texture1Id");

            migrationBuilder.CreateIndex(
                name: "IX_Blocks_Texture2Id",
                table: "Blocks",
                column: "Texture2Id");

            migrationBuilder.CreateIndex(
                name: "IX_Blocks_Texture3Id",
                table: "Blocks",
                column: "Texture3Id");

            migrationBuilder.CreateIndex(
                name: "IX_Blocks_Texture4Id",
                table: "Blocks",
                column: "Texture4Id");

            migrationBuilder.CreateIndex(
                name: "IX_Blocks_Texture5Id",
                table: "Blocks",
                column: "Texture5Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Blocks_Textures_Texture0Id",
                table: "Blocks",
                column: "Texture0Id",
                principalTable: "Textures",
                principalColumn: "TextureId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Blocks_Textures_Texture1Id",
                table: "Blocks",
                column: "Texture1Id",
                principalTable: "Textures",
                principalColumn: "TextureId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Blocks_Textures_Texture2Id",
                table: "Blocks",
                column: "Texture2Id",
                principalTable: "Textures",
                principalColumn: "TextureId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Blocks_Textures_Texture3Id",
                table: "Blocks",
                column: "Texture3Id",
                principalTable: "Textures",
                principalColumn: "TextureId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Blocks_Textures_Texture4Id",
                table: "Blocks",
                column: "Texture4Id",
                principalTable: "Textures",
                principalColumn: "TextureId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Blocks_Textures_Texture5Id",
                table: "Blocks",
                column: "Texture5Id",
                principalTable: "Textures",
                principalColumn: "TextureId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Blocks_Textures_Texture0Id",
                table: "Blocks");

            migrationBuilder.DropForeignKey(
                name: "FK_Blocks_Textures_Texture1Id",
                table: "Blocks");

            migrationBuilder.DropForeignKey(
                name: "FK_Blocks_Textures_Texture2Id",
                table: "Blocks");

            migrationBuilder.DropForeignKey(
                name: "FK_Blocks_Textures_Texture3Id",
                table: "Blocks");

            migrationBuilder.DropForeignKey(
                name: "FK_Blocks_Textures_Texture4Id",
                table: "Blocks");

            migrationBuilder.DropForeignKey(
                name: "FK_Blocks_Textures_Texture5Id",
                table: "Blocks");

            migrationBuilder.DropIndex(
                name: "IX_Blocks_Texture0Id",
                table: "Blocks");

            migrationBuilder.DropIndex(
                name: "IX_Blocks_Texture1Id",
                table: "Blocks");

            migrationBuilder.DropIndex(
                name: "IX_Blocks_Texture2Id",
                table: "Blocks");

            migrationBuilder.DropIndex(
                name: "IX_Blocks_Texture3Id",
                table: "Blocks");

            migrationBuilder.DropIndex(
                name: "IX_Blocks_Texture4Id",
                table: "Blocks");

            migrationBuilder.DropIndex(
                name: "IX_Blocks_Texture5Id",
                table: "Blocks");

            migrationBuilder.DropColumn(
                name: "Created",
                table: "Textures");

            migrationBuilder.DropColumn(
                name: "Height",
                table: "Textures");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Textures");

            migrationBuilder.DropColumn(
                name: "Size",
                table: "Textures");

            migrationBuilder.DropColumn(
                name: "Width",
                table: "Textures");

            migrationBuilder.DropColumn(
                name: "Created",
                table: "Blocks");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Textures",
                newName: "src");
        }
    }
}
