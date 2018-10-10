using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using CostumerExample.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CostumerExample.Controllers
{
    public class MainController : Controller
    {



        //Action method for Index.cshtml
        [HttpGet]
        public IActionResult Index()
        {

            return View();
        }
    
        //Action method for Error.cshtml
        [HttpGet]
        public IActionResult Error()
        {
            return View();
        }

        //Action method for Costumer.cshtml
        //Retrieving the costumer data by id and returns the model to view
        [HttpGet]
        public IActionResult Costumer(string Id){
            Costumers CostumerRecord = null;

            using(DatabaseContext DB = new DatabaseContext()){

                CostumerRecord = DB.Costumers.Include(p => p.CostumerStatus).First(p => p.CostumerId == Id);
            }

            return View(CostumerRecord);
        }


        //Returns the list of available status from database
        [HttpGet]
        public JsonResult StatusList(){

            using (DatabaseContext DB = new DatabaseContext())
            {
                return Json(DB.CostumerStatus.OrderBy(p => p.StatusId).ToList());
            }

        }

        //Returns the notes related to customer id
        [HttpGet]
        public JsonResult GetNotes(string id){

            using (DatabaseContext DB = new DatabaseContext())
            {
                return Json(DB.CostumerNotes.Where(p => p.CostumerId == id).OrderBy(p => p.CreationDT).Select(p => new
                {
                    noteid = p.NoteId,
                    note = p.Note,
                    creationDT = p.CreationDT.ToString("dd/MM/yyyy hh:mm:ss")

                }).ToList());
            }

        }

        //Returns the list of customers
        //If sortField and sortType are not null or not empty the data will be sorted by using these information
        //If filterField and filterValues are not null the data will be filtered by using these parameters
        [HttpGet]
        public JsonResult CostumersList(string sortField, string sortType, string filterFields, string filterValues){

            using (DatabaseContext DB = new DatabaseContext())
            {
                IQueryable<Costumers> Data = null;
                List<Costumers> Results = null;

                if (filterFields != null && filterValues  != null && filterFields != string.Empty && filterValues != string.Empty){

                    string[] Fields = filterFields.Split(';');
                    string[] Values = filterValues.Split(';');

                    string WhereCondition = "";

                    for (int i = 0; i < Fields.Length - 1; i++){
                        WhereCondition += Fields[i] + ".ToLower().Contains(" + "\"" + Values[i].ToLower() + "\"" + ")";
                        if (i < Fields.Length - 2) WhereCondition += " && ";
                    }
                    Data = DB.Costumers.Include(p => p.CostumerStatus).Where(WhereCondition);

                    //Data = DB.Costumers.Include(p => p.CostumerStatus).Where(filterField + ".ToLower().Contains(" + "\"" + filterText.ToLower() + "\"" + ")");

                }
                else
                {
                    Data = DB.Costumers.Include(p => p.CostumerStatus);
                }



                if (sortField != null && sortField != string.Empty){
                    if (sortType == "1"){
                        Results = Data.OrderBy(sortField).ToList();
                    }
                    else
                    {
                        Results = Data.OrderBy(sortField + " descending").ToList();
                    }
                }
                else
                {
                    Results = Data.ToList();
                }


                return Json(Results);
            }


        }

        //Allow the user to update the status of costumer passing the StatusChange model
        [HttpPost]
        public JsonResult UpdateStatus([FromBody] StatusChange postData)
        {

            string CostumerId = postData.costumerId;
            int NewStatus = postData.statusId;

            using (DatabaseContext DB = new DatabaseContext())
            {

                var Record = DB.Costumers.First(p => p.CostumerId == CostumerId);

                if (Record != null)
                {

                    Record.StatusId = NewStatus;
                    DB.Entry(Record).State = EntityState.Modified;

                    try
                    {
                        DB.SaveChanges();
                    }
                    catch (Exception ex)
                    {
                        var p = ex;
                    }


                    return Json("ok");
                }
                else
                {
                    return Json("ko");
                }


            }
        }





    }
}
