using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CostumerExample.Models
{
    public class CostumerStatus
    {
        [Key]
        public int StatusId { get; set; }
        public string Status { get; set; }
        public int Enabled { get; set; }

    }
}
