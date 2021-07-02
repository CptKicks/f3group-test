<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="card">
                    <div class="card-header">Table to CSV Generator</div>

                    <div class="card-body">
                        <table class="table table-bordered">
                            <thead>
                            <tr>
                                <th></th>
                                <th v-for="(column, index) in columns">
                                    <div class="text-center mb-3">
                                        <a href="#" @click.prevent="index_cache = index; $bvModal.show('remove_column_modal');" class="btn btn-danger">Remove</a>
                                    </div>
                                    <input type="text"
                                           class="form-control"
                                           :value="column.key"
                                           @input="update_column_key(column, $event)"
                                    />
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(row, index) in data">
                                <td>
                                    <div class="text-center">
                                        <a href="#" @click.prevent="index_cache = index; $bvModal.show('remove_row_modal');" class="btn btn-danger">Remove</a>
                                    </div>
                                </td>
                                <td v-for="(column) in columns">
                                    <input type="text" class="form-control" v-model="row[column.key]"/>
                                    {{ column.key }}
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        <button id="add_column_btn" type="button" class="btn btn-secondary" @click="$bvModal.show('add_column_modal')">Add Column</button>
                        <button id="add_row_btn" type="button" class="btn btn-secondary" @click="add_row()">Add Row</button>
                    </div>

                    <div class="card-footer text-right">
                        <button class="btn btn-primary" type="button" @click="submit()">Export</button>
                    </div>
                </div>
            </div>
        </div>

        <b-modal id="add_column_modal" @ok="add_column()" v-bind:static="true" v-bind:title="'Add new Column'" v-bind:ok-disabled="!check_new_column_name_validity()">
            <div class="form-group">
                <label for="new_column_name_input" class="mb-3">Please enter a name for the new column</label>
                <input type="text" id="new_column_name_input" name="new_column_name" ref="new_column_name_input" class="form-control"
                       required v-model="new_column_name"
                />
            </div>
        </b-modal>

        <b-modal id="remove_column_modal" @ok="remove_column()" @hidden="index_cache = null" v-bind:static="true">Do you want to remove the column?</b-modal>
        <b-modal id="remove_row_modal" @ok="remove_row()" @hidden="index_cache = null" v-bind:static="true">Do you want to remove the row?</b-modal>
    </div>
</template>

<script>
export default {
    name: "CSVGenerator",

    data() {
        return {
            data: [
                {
                    first_name: 'John',
                    last_name: 'Doe',
                    emailAddress: 'john.doe@example.com'
                },
                {
                    first_name: 'John',
                    last_name: 'Doe',
                    emailAddress: 'john.doe@example.com'
                },
            ],
            columns: [
                { key: 'first_name' },
                { key: 'last_name' },
                { key: 'emailAddress' },
            ],
            index_cache: null,
            new_column_name: '',
        }
    },

    methods: {
        // Add new row to data with existing column keys
        add_row() {
            const newRow = {};
            this.columns.forEach(
                (col) => {
                    newRow[col.key] = ''
                }
            );

            this.data.push(newRow);

            this.$bvToast.toast('Row has been added successfully', {
                title: `Row Added`,
                variant: 'success',
                solid: true
            });
        },
        // Remove row based on the index_cache set on Remove button click
        remove_row() {
            this.data.splice(this.index_cache, 1);
            this.index_cache = null;

            this.$bvToast.toast('Row has been removed successfully', {
                title: `Row Removed`,
                variant: 'success',
                solid: true
            });
        },
        // Shows a modal with a text input for the new column name and then adds a new column and backfills all existing rows
        add_column() {
            // Add new column to columns property
            const key = this.new_column_name;
            const isNotDuplicate = !this.columns.find((col) => col.key === this.new_column_name);

            if (isNotDuplicate) {
                this.columns.push({key});

                // Backfill all existing rows
                this.data.map(
                    (row) => {
                        row[key] = '';

                        return row;
                    }
                );

                this.$bvToast.toast('Column has been added successfully', {
                    title: `Column Added`,
                    variant: 'success',
                    solid: true
                });
                this.new_column_name = '';
            }
        },
        // Remove column based on the index_cache set on Remove button click
        remove_column() {
            // Remove all data related to column key
            const key = this.columns[this.index_cache].key;
            this.data.map(
                (row) => {
                    delete row[key];
                    return row;
                }
            );

            // Remove column key
            this.columns.splice(this.index_cache, 1);
            this.index_cache = null;

            this.$bvToast.toast('Column has been removed successfully', {
                title: `Column Removed`,
                variant: 'success',
                solid: true
            });
        },
        // Updates column key on input on the column input fields
        update_column_key(column, event) {
            let oldKey = column.key;

            let columnKeyExists = !!this.columns.find(column => column.key === event.target.value);

            column.key = event.target.value;

            if (columnKeyExists) {
                column.key = event.target.value.substring(0, event.target.value.length - 1);
                return;
            }

            this.data.forEach(
                (row) => {
                    if (row[oldKey]) {
                        row[column.key] = row[oldKey];
                        delete row[oldKey];
                    }
                }
            )
        },
        // API request that sends all the data in the table and should automatically starts a download on a csv file
        submit() {
            return axios.patch('/api/csv-export', this.data, {
                responseType: 'blob'
            })
                .then((response) => {
                    const url = window.URL.createObjectURL(
                        new Blob([response.data], {type: "text/csv"})
                    );

                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", 'table.csv');

                    link.click();
                })
                .catch((error) => {
                    this.$bvToast.toast(`${error}`, {
                        title: 'Error downloading CSV',
                        variant: 'danger',
                        solid: true
                    });
                });
        },

        // Checks if the new column name input is snake_case && is not a duplicate
        check_new_column_name_validity() {
            const snake_case_regex = new RegExp('^(?:[a-z|1-9]+_)*[a-z|1-9]+$');
            const isSnakeCase = snake_case_regex.test(this.new_column_name);
            const isNotDuplicateColumnName = !this.columns.find( (column) => column.key === this.new_column_name );

            return isSnakeCase && isNotDuplicateColumnName;
        }
    },

    watch: {}
}
</script>

<style scoped>
    .form-control {
        min-width: 125px;
    }
</style>
