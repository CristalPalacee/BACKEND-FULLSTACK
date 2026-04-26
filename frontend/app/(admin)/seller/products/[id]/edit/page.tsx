  import { notFound } from "next/navigation";
  import { ProductForm } from "@/components/admin/products/product-form";
import { getCategories, getSellerProductById } from "@/app/server/product.action";




  type PageProps = {
    params: Promise<{ id: string }>;
  };

  export default async function EditProductPage({ params }: PageProps) {
    
    const { id } = await params;

    const [categories, product] = await Promise.all([
      getCategories(),
      getSellerProductById(id),
    ]);

    if (!product) {
      notFound();
    }

    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">
            Edit Produk
          </h1>
          <p className="text-muted-foreground">
            Perbarui informasi akun game.
          </p>
        </div>

        <ProductForm
          mode="edit"
          productId={product.id}
          categories={categories}
          defaultValues={{
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            stock: product.stock,
            categoryId: product.categoryId,
            gameTitle: product.gameTitle,
            accountLevel: product.accountLevel ?? undefined,
            rank: product.rank ?? "",
            serverRegion: product.serverRegion ?? "",
            loginMethod: product.loginMethod ?? "",
            thumbnailUrl: product.thumbnailUrl ?? "",
            status: product.status,
          }}
        />
      </div>
    );
  }