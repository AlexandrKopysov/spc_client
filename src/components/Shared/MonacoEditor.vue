<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as monaco from 'monaco-editor';

export default defineComponent({
  name: 'MonacoEditor',

  props: {
    options: Object,
    theme: String,
    language: String,
    value: String,
  },
  emits: ['editorDidMount', 'change'],
  methods: {
    initMonaco() {
      const { value, language, theme, options } = this;
      const editor = monaco.editor.create(this.$el, {
        value: value,
        language: language,
        theme: theme,
        ...options,
      });
      editor.onDidChangeModelContent((event) => {
        const value = editor.getValue();
        if (this.value !== value) {
          this.$emit('change', value, event);
        }
      });
      this._setEditor(editor);
      this.$emit('editorDidMount', editor);
    },
    _setValue(value) {
      this._getEditor()?.setValue(value);
    },
    _getEditor(): monaco.editor.IStandaloneCodeEditor {
      return this.$options.editor;
    },
    _setEditor(editor: monaco.editor.IStandaloneCodeEditor) {
      this.$options.editor = editor;
    },
  },
  watch: {
    options: {
      deep: true,
      handler(options) {
        this._getEditor()?.updateOptions(options);
      },
    },
    value() {
      this.value !== this._getEditor()?.getValue() && this._setValue(this.value);
    },
  },
  mounted() {
    this.initMonaco();
  },
});
</script>
