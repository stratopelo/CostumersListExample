using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CostumerExample.Models
{
    public class Costumers
    {
        [Key]
        public string CostumerId { get; set; }
        public int StatusId { get; set; }
        public string CostumerName { get; set; }
        public string Country { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string ZipCode { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime CreationDT { get; set; }


        public List<CostumerNotes> Notes { get; set; }


        public CostumerStatus CostumerStatus { get; set; }
    }
}
