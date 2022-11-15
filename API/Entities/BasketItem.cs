using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("BasketItems")] // annotation to rename the table inside the database
    public class BasketItem
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        //navigation properties - One to One relation BasketItem <=> Product
        public int ProductId { get; set; } // it can automaticially be searche by this id
        public Product Product { get; set; }

        // another navigation properties to the Basket is needed to make the relationship bi-directional and remove the basketItems once
        // Basket is removed (using Cascade)
        public int BasketId { get; set; } // class name + Id
        public Basket Basket { get; set; } // 
    }
}