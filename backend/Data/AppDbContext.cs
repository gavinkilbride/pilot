using Microsoft.EntityFrameworkCore;
using PilotApi.Models;

namespace PilotApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Item> Items => Set<Item>();
}
