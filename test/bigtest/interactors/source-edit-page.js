import {
  clickable,
  interactor,
  isPresent,
  text,
  value,
} from '@bigtest/interactor';

@interactor class ImplementationStatusSelect {
  static defaultScope = 'select[name="status"]';
  value = value();
}

@interactor class DeleteSourceConfirmation {
  static defaultScope = '#delete-source-confirmation';
}

export default @interactor class EditSourcePage {
  static defaultScope = '[data-test-source-form-page]';
  isLoaded = isPresent('[class*=paneTitleLabel---]');

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

  title = text('[class*=paneTitleLabel---]');
  implementationStatusSelect = new ImplementationStatusSelect();
  deleteSourceConfirmation = new DeleteSourceConfirmation();

  clickDeleteSource = clickable('#clickable-delete-source');
}