using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

using System;
using Microsoft.Data.Sqlite;

namespace CostumerExample.Models
{
    public class DatabaseContext : DbContext
    {
        public DbSet<Costumers> Costumers { get; set; }
        public DbSet<CostumerStatus> CostumerStatus { get; set; }
        public DbSet<CostumerNotes> CostumerNotes { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=./Data/TestDb.db");

            /*
            if (!optionsBuilder.IsConfigured)
            {
                var builder = new SqliteConnectionStringBuilder(connectionString);
                builder.DataSource = Path.GetFullPath(
                    Path.Combine(
                        AppDomain.CurrentDomain.GetData("DataDirectory") as string
                            ?? AppDomain.CurrentDomain.BaseDirectory,
                        builder.DataSource);
                connectionString = builder.ToString();

                string path = WebConfigurationManager.ConnectionStrings["MyDatastore"].ConnectionString;
                optionsBuilder.UseSqlite(path);
            }
            */
        }



    }
}
