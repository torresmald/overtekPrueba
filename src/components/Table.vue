<template>
    <v-card>
        <div class="text-center mb-4">
            <v-btn :disabled="loading" append-icon="mdi-refresh" text="Refresh" variant="outlined"
                @click="onClick"></v-btn>
        </div>
        <v-text-field class="mb-4" v-model="search" density="compact" label="Filtrar Categoria" prepend-inner-icon="mdi-magnify"
            variant="solo-filled" flat hide-details single-line></v-text-field>
        <div class="d-flex justify-center mb-4 ga-16">
            <v-text-field class="mb-4 w-25" v-model="from" density="compact" label="Precio Desde" prepend-inner-icon="mdi-magnify"
                variant="solo-filled" flat hide-details single-line></v-text-field>
            <v-text-field class="mb-4 w-25" v-model="to" density="compact" label="Precio Hasta" prepend-inner-icon="mdi-magnify"
                variant="solo-filled" flat hide-details single-line></v-text-field>
        </div>

        <v-data-table :headers="headers" :items="filteredProducts" :items-per-page="5" v-model:sort-by="sortBy"
            :filter-keys="['categoria']" v-model:search="search" v-model:from="from" :loading="loading">
            <template v-slot:item="{ item }">
                <tr :class="getRowClass(item)">
                    <td>{{ item.name }}</td>
                    <td>{{ item.categoria }}</td>
                    <td>
                        <span v-if="item.precio > 500">
                            <v-chip  :color="getColor(item.precio)">
                            {{ item.precio }} €
                        </v-chip>
                        </span>
                        <span v-else>
                            {{ item.precio }} €
                        </span>
                        
                        
                    </td>
                    <td>{{ item.puntuacion }}</td>
                </tr>
            </template>
            <template v-slot:loading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
            </template>

        </v-data-table>
    </v-card>
</template>
<script>
import { getProductsApi } from '../api/data.js'
export default {
    data() {
        return {
            loading: false,
            products: [],
            search: '',
            from: '',
            to: '',
            headers: [
                { title: 'Nombre', value: 'name', sortable: true, key: 'nombre' },
                { title: 'Categoria', value: 'categoria', sortable: true, key: 'categoria' },
                { title: 'Precio', value: 'precio', sortable: true, key: 'precio' },
                { title: 'Puntuacion', value: 'puntuacion', sortable: true, key: 'puntuacion' },
            ],
            sortBy: [{ key: 'nombre', order: 'asc' }],
        }
    },
    computed: {
        filteredProducts() {
            return this.products.filter(item => {
                const fromCondition = this.from ? item.precio >= this.from : true;
                const toCondition = this.to ? item.precio <= this.to : true;
                return fromCondition && toCondition;
            });
        }
    },
    async mounted() {
        this.getProducts()
    },
    methods: {
        getColor(precio) {
            if (precio > 500) return 'red'
            return ' '
        },
        getRowClass(item) {
            return item.precio < 20 ? 'row-green' : '';
        },
        async onClick() {
            this.getProducts()
        },
        async getProducts() {
            try {
                this.loading = true
                const productsResponse = await getProductsApi()
                this.products = productsResponse.map(product => ({
                    name: product.title,
                    categoria: product.category,
                    precio: product.price,
                    puntuacion: product.rating.rate
                }))
            } catch (error) {
                console.log(error);
            } finally {
                this.loading = false
            }
        }


    },
}
</script>
<style scoped>
.row-green {
    background-color: lightgreen !important;
}
</style>
