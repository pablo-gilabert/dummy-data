import type { CartItem as CartItemType } from "../../types/CartItem"

import {
  useCart,
} from "../../CartContext/useCart"

import { Link } from "react-router-dom"

import Swal from "sweetalert2"

import styles from "./CartItem.module.css"

interface CartItemProps {
  item: CartItemType
}

const CartItem = ({
  item,
}: CartItemProps) => {

  const {
    addItem,
    removeItem,
    clearItem,
  } = useCart()

  const handleRemove = async () => {

    const result = await Swal.fire({
      title: "Remove product?",
      text: `"${item.product.title}" will be removed from your cart.`,
      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Remove",
      cancelButtonText: "Cancel",

      confirmButtonColor: "#d62828",
      cancelButtonColor: "#6c757d",

      reverseButtons: true,
    })

    if (result.isConfirmed) {

      clearItem(item.product.id)

      await Swal.fire({
        title: "Removed",
        text: "The product was removed from your cart.",
        icon: "success",

        confirmButtonText: "OK",
        confirmButtonColor: "#2a9d8f",
      })

    }
  }

  return (

    <article className={styles.item}>

      <Link
        className={styles.productLink}
        to={`/products/${item.product.id}`}
      >

        <img
          className={styles.image}
          src={item.product.thumbnail}
          alt={item.product.title}
        />

        <div className={styles.info}>

          <h2 className={styles.title}>
            {item.product.title}
          </h2>

          <p className={styles.price}>
            $ {item.product.price.toFixed(2)}
          </p>

        </div>

      </Link>

      <div className={styles.quantity}>

        <button
          className={styles.quantityButton}
          type="button"
          onClick={() =>
            removeItem(item.product.id)
          }
          aria-label={`Decrease quantity of ${item.product.title}`}
        >
          −
        </button>

        <span className={styles.quantityValue}>
          {item.quantity}
        </span>

        <button
          className={styles.quantityButton}
          type="button"
          onClick={() =>
            addItem(item.product)
          }
          aria-label={`Increase quantity of ${item.product.title}`}
        >
          +
        </button>

      </div>

      <button
        className={styles.removeButton}
        type="button"
        onClick={handleRemove}
      >
        Remove
      </button>

    </article>
  )
}

export default CartItem