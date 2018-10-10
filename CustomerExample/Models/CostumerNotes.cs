using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CostumerExample.Models
{
    public class CostumerNotes
    {
        [Key]
        public int NoteId { get; set; }
        public string Note { get; set; }
        public DateTime CreationDT { get; set; }
     
        public string CostumerId { get; set; }
        public Costumers Costumer { get; set; }
    }
}
