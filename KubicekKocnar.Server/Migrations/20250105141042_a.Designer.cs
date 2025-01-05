﻿// <auto-generated />
using System;
using KubicekKocnar.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace KubicekKocnar.Server.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20250105141042_a")]
    partial class a
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.11");

            modelBuilder.Entity("KubicekKocnar.Server.Models.Block", b =>
                {
                    b.Property<uint>("BlockId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Attributes")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("Created")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<uint?>("Texture0Id")
                        .HasColumnType("INTEGER");

                    b.Property<uint?>("Texture1Id")
                        .HasColumnType("INTEGER");

                    b.Property<uint?>("Texture2Id")
                        .HasColumnType("INTEGER");

                    b.Property<uint?>("Texture3Id")
                        .HasColumnType("INTEGER");

                    b.Property<uint?>("Texture4Id")
                        .HasColumnType("INTEGER");

                    b.Property<uint?>("Texture5Id")
                        .HasColumnType("INTEGER");

                    b.HasKey("BlockId");

                    b.HasIndex("Texture0Id");

                    b.HasIndex("Texture1Id");

                    b.HasIndex("Texture2Id");

                    b.HasIndex("Texture3Id");

                    b.HasIndex("Texture4Id");

                    b.HasIndex("Texture5Id");

                    b.ToTable("Blocks");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.Coinage", b =>
                {
                    b.Property<uint>("CoinageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<uint>("IconId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("CoinageId");

                    b.HasIndex("IconId");

                    b.ToTable("Coinages");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.Cost", b =>
                {
                    b.Property<uint>("CostId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<uint>("CoinageId")
                        .HasColumnType("INTEGER");

                    b.Property<uint>("Count")
                        .HasColumnType("INTEGER");

                    b.Property<uint?>("ItemUpgradeId")
                        .HasColumnType("INTEGER");

                    b.Property<uint?>("PlayerUpgradeId")
                        .HasColumnType("INTEGER");

                    b.HasKey("CostId");

                    b.HasIndex("CoinageId");

                    b.HasIndex("ItemUpgradeId");

                    b.HasIndex("PlayerUpgradeId");

                    b.ToTable("Cost");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.Feature", b =>
                {
                    b.Property<uint>("FeatureId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("Created")
                        .HasColumnType("TEXT");

                    b.Property<uint>("LevelId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Params")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<uint>("Type")
                        .HasColumnType("INTEGER");

                    b.Property<double>("X")
                        .HasColumnType("REAL");

                    b.Property<double>("Y")
                        .HasColumnType("REAL");

                    b.Property<double>("Z")
                        .HasColumnType("REAL");

                    b.HasKey("FeatureId");

                    b.HasIndex("LevelId");

                    b.ToTable("Features");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.Game", b =>
                {
                    b.Property<uint>("GameId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("Created")
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<bool>("Published")
                        .HasColumnType("INTEGER");

                    b.Property<string>("UserId")
                        .HasColumnType("TEXT");

                    b.HasKey("GameId");

                    b.HasIndex("UserId");

                    b.ToTable("Games");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.Item", b =>
                {
                    b.Property<uint>("ItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<uint>("Type")
                        .HasColumnType("INTEGER");

                    b.HasKey("ItemId");

                    b.ToTable("Items");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.ItemUpgrade", b =>
                {
                    b.Property<uint>("ItemUpgradeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<uint>("InputItemId")
                        .HasColumnType("INTEGER");

                    b.Property<uint>("OutputItemId")
                        .HasColumnType("INTEGER");

                    b.HasKey("ItemUpgradeId");

                    b.HasIndex("InputItemId");

                    b.HasIndex("OutputItemId");

                    b.ToTable("ItemUpgrades");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.Level", b =>
                {
                    b.Property<uint>("LevelId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("Created")
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<uint>("GameId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<uint?>("NextLevelId")
                        .HasColumnType("INTEGER");

                    b.HasKey("LevelId");

                    b.HasIndex("GameId");

                    b.ToTable("Levels");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.PlacedBlock", b =>
                {
                    b.Property<uint>("PlacedBlockId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<uint>("BlockId")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("Created")
                        .HasColumnType("TEXT");

                    b.Property<uint>("LevelId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("State")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<double>("X")
                        .HasColumnType("REAL");

                    b.Property<double>("Y")
                        .HasColumnType("REAL");

                    b.Property<double>("Z")
                        .HasColumnType("REAL");

                    b.HasKey("PlacedBlockId");

                    b.HasIndex("BlockId");

                    b.HasIndex("LevelId");

                    b.ToTable("PlacedBlocks");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.PlayerUpgrade", b =>
                {
                    b.Property<uint>("PlayerUpgradeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<uint?>("IconId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("PlayerUpgradeId");

                    b.HasIndex("IconId");

                    b.ToTable("PlayerUpgrades");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.Role", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("TEXT");

                    b.Property<string>("ConcurrencyStamp")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<string>("NormalizedName")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.Texture", b =>
                {
                    b.Property<uint>("TextureId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<byte[]>("Content")
                        .IsRequired()
                        .HasColumnType("BLOB");

                    b.Property<DateTime>("Created")
                        .HasColumnType("TEXT");

                    b.Property<int>("Height")
                        .HasColumnType("INTEGER");

                    b.Property<uint?>("ItemId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("Size")
                        .HasColumnType("INTEGER");

                    b.Property<uint>("State")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("Width")
                        .HasColumnType("INTEGER");

                    b.HasKey("TextureId");

                    b.HasIndex("ItemId");

                    b.ToTable("Textures");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.User", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("TEXT");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("INTEGER");

                    b.Property<string>("ConcurrencyStamp")
                        .HasColumnType("TEXT");

                    b.Property<string>("Email")
                        .HasColumnType("TEXT");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("INTEGER");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("TEXT");

                    b.Property<string>("NormalizedEmail")
                        .HasColumnType("TEXT");

                    b.Property<string>("NormalizedUserName")
                        .HasColumnType("TEXT");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("TEXT");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("TEXT");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("INTEGER");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("TEXT");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("INTEGER");

                    b.Property<string>("UserName")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("ClaimType")
                        .HasColumnType("TEXT");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserId")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("UserClaims");
                });

            modelBuilder.Entity("RoleUser", b =>
                {
                    b.Property<string>("RolesId")
                        .HasColumnType("TEXT");

                    b.Property<string>("UsersId")
                        .HasColumnType("TEXT");

                    b.HasKey("RolesId", "UsersId");

                    b.HasIndex("UsersId");

                    b.ToTable("RoleUser");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.Block", b =>
                {
                    b.HasOne("KubicekKocnar.Server.Models.Texture", "Texture0")
                        .WithMany("Blocks0")
                        .HasForeignKey("Texture0Id")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("KubicekKocnar.Server.Models.Texture", "Texture1")
                        .WithMany("Blocks1")
                        .HasForeignKey("Texture1Id")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("KubicekKocnar.Server.Models.Texture", "Texture2")
                        .WithMany("Blocks2")
                        .HasForeignKey("Texture2Id")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("KubicekKocnar.Server.Models.Texture", "Texture3")
                        .WithMany("Blocks3")
                        .HasForeignKey("Texture3Id")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("KubicekKocnar.Server.Models.Texture", "Texture4")
                        .WithMany("Blocks4")
                        .HasForeignKey("Texture4Id")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("KubicekKocnar.Server.Models.Texture", "Texture5")
                        .WithMany("Blocks5")
                        .HasForeignKey("Texture5Id")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.Navigation("Texture0");

                    b.Navigation("Texture1");

                    b.Navigation("Texture2");

                    b.Navigation("Texture3");

                    b.Navigation("Texture4");

                    b.Navigation("Texture5");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.Coinage", b =>
                {
                    b.HasOne("KubicekKocnar.Server.Models.Texture", "Icon")
                        .WithMany("Coinages")
                        .HasForeignKey("IconId")
                        .OnDelete(DeleteBehavior.SetNull)
                        .IsRequired();

                    b.Navigation("Icon");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.Cost", b =>
                {
                    b.HasOne("KubicekKocnar.Server.Models.Coinage", "Coinage")
                        .WithMany("Costs")
                        .HasForeignKey("CoinageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("KubicekKocnar.Server.Models.ItemUpgrade", null)
                        .WithMany("Costs")
                        .HasForeignKey("ItemUpgradeId");

                    b.HasOne("KubicekKocnar.Server.Models.PlayerUpgrade", null)
                        .WithMany("Costs")
                        .HasForeignKey("PlayerUpgradeId");

                    b.Navigation("Coinage");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.Feature", b =>
                {
                    b.HasOne("KubicekKocnar.Server.Models.Level", "Level")
                        .WithMany("Features")
                        .HasForeignKey("LevelId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Level");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.Game", b =>
                {
                    b.HasOne("KubicekKocnar.Server.Models.User", "Author")
                        .WithMany("Games")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("Author");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.ItemUpgrade", b =>
                {
                    b.HasOne("KubicekKocnar.Server.Models.Item", "InputItem")
                        .WithMany()
                        .HasForeignKey("InputItemId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("KubicekKocnar.Server.Models.Item", "OutputItem")
                        .WithMany()
                        .HasForeignKey("OutputItemId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("InputItem");

                    b.Navigation("OutputItem");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.Level", b =>
                {
                    b.HasOne("KubicekKocnar.Server.Models.Game", "Game")
                        .WithMany("Levels")
                        .HasForeignKey("GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.PlacedBlock", b =>
                {
                    b.HasOne("KubicekKocnar.Server.Models.Block", "Block")
                        .WithMany("PlacedBlocks")
                        .HasForeignKey("BlockId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("KubicekKocnar.Server.Models.Level", "Level")
                        .WithMany("Blocks")
                        .HasForeignKey("LevelId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Block");

                    b.Navigation("Level");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.PlayerUpgrade", b =>
                {
                    b.HasOne("KubicekKocnar.Server.Models.Texture", "Icon")
                        .WithMany("PlayerUpgrades")
                        .HasForeignKey("IconId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.Navigation("Icon");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.Texture", b =>
                {
                    b.HasOne("KubicekKocnar.Server.Models.Item", "Item")
                        .WithMany("Icons")
                        .HasForeignKey("ItemId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.Navigation("Item");
                });

            modelBuilder.Entity("RoleUser", b =>
                {
                    b.HasOne("KubicekKocnar.Server.Models.Role", null)
                        .WithMany()
                        .HasForeignKey("RolesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("KubicekKocnar.Server.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UsersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.Block", b =>
                {
                    b.Navigation("PlacedBlocks");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.Coinage", b =>
                {
                    b.Navigation("Costs");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.Game", b =>
                {
                    b.Navigation("Levels");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.Item", b =>
                {
                    b.Navigation("Icons");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.ItemUpgrade", b =>
                {
                    b.Navigation("Costs");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.Level", b =>
                {
                    b.Navigation("Blocks");

                    b.Navigation("Features");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.PlayerUpgrade", b =>
                {
                    b.Navigation("Costs");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.Texture", b =>
                {
                    b.Navigation("Blocks0");

                    b.Navigation("Blocks1");

                    b.Navigation("Blocks2");

                    b.Navigation("Blocks3");

                    b.Navigation("Blocks4");

                    b.Navigation("Blocks5");

                    b.Navigation("Coinages");

                    b.Navigation("PlayerUpgrades");
                });

            modelBuilder.Entity("KubicekKocnar.Server.Models.User", b =>
                {
                    b.Navigation("Games");
                });
#pragma warning restore 612, 618
        }
    }
}
