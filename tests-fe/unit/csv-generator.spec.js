import { mount } from '@vue/test-utils';
import CSVGenerator from "../../resources/js/components/CSVGenerator.vue";

describe('CSVGenerator', () => {
    it('adds a row', () => {
        const wrapper = mount(CSVGenerator);
        const rows_before = wrapper.vm.data.length;

        wrapper.find('#add_row_btn').trigger('click');

        const rows_after = wrapper.vm.data.length;
        expect(rows_after - rows_before).toBe(1);
    });

    it('removes a row', async () => {
        const wrapper = mount(CSVGenerator);
        const rows_before = wrapper.vm.data.length;

        await wrapper.find('.table tbody .btn').trigger('click');
        wrapper.find('#remove_row_modal .btn-primary').trigger('click');

        const rows_after = wrapper.vm.data.length;
        expect(rows_before - rows_after).toBe(1)
    });

    it('adds a column', async () => {
        const wrapper = mount(CSVGenerator);
        const new_column_name = 'snake_name';
        wrapper.find('#add_column_btn').trigger('click');

        const modal = wrapper.find('#add_column_modal');
        await modal.find('input').setValue(new_column_name);
        modal.find('.btn-primary').trigger('click');

        expect(wrapper.vm.columns).toContainEqual({key: new_column_name});
    });

    it('can\'t add a column without snake_case', async () => {
        const wrapper = mount(CSVGenerator);
        const new_column_name = 'snakE_name';
        wrapper.find('#add_column_btn').trigger('click');

        const modal = wrapper.find('#add_column_modal');
        await modal.find('input').setValue(new_column_name);
        modal.find('.btn-primary').trigger('click');

        expect(wrapper.vm.columns).not.toContainEqual({key: new_column_name});
    });

    it('can\'t add a column with duplicate name',  () => {
        const wrapper = mount(CSVGenerator);
        const new_column_name = wrapper.vm.columns[0].key;
        const columns_before = wrapper.vm.columns.length;

        wrapper.setData({ new_column_name })
        wrapper.vm.add_column();

        const columns_after = wrapper.vm.columns.length;
        expect(columns_after - columns_before).toBe(0);
    });

    it('removes a column', async () => {
        const wrapper = mount(CSVGenerator);
        const columns_before = wrapper.vm.columns.length;

        await wrapper.find('.table thead .btn').trigger('click');
        wrapper.find('#remove_column_modal .btn-primary').trigger('click');

        const columns_after = wrapper.vm.columns.length;
        expect(columns_before - columns_after).toBe(1)
    });

    it('can update column key', () => {
        const wrapper = mount(CSVGenerator);
        const first_column_name_input = wrapper.find('thead input[type="text"]');
        const first_column_name = first_column_name_input.element.value;

        const new_column_name = 'simple_name';
        first_column_name_input.setValue(new_column_name);

        expect(wrapper.vm.columns).not.toContainEqual({key: first_column_name});
        expect(wrapper.vm.columns).toContainEqual({key: new_column_name});
    });
});
