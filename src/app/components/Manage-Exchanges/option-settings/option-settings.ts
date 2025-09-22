
import { Component, OnInit, Input } from '@angular/core';
// import { OptionGroupModel } from '../../../models/optiongroup.models';
// import { ExchangeService } from '../exchangeservice.service';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OptionGroupModel } from '../../Models/optiongroup.models';
import { OptionSettingModel, UpdateOptionModel } from '../../Models/optionsetting.Models';
import { LicenseService } from '../../../services/Licenses/licenseservice.service';
import { Exchangenavbar } from '../exchangenavbar/exchangenavbar';
// import { OptionSettingModel, UpdateOptionModel } from '../../../models/optionsetting.Models';

@Component({
  selector: 'app-option-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Exchangenavbar],
  templateUrl: './option-settings.html',
  styleUrls: ['./option-settings.scss']
})
export class OptionSettings implements OnInit {
  @Input() exchangeId: number = 0;
  groupTitles: OptionGroupModel[] = [];
  selectedGroup: OptionGroupModel | null = null;
  selectedGroupOptions: OptionSettingModel[] = [];
  allOptions: OptionSettingModel[] = [];

  constructor(private route: ActivatedRoute, private licenseService: LicenseService, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.exchangeId = +params['exchangeId'] || 0;
      this.loadOptionSettings();
    });
  }

  loadOptionSettings(): void {
    this.licenseService.getLicenseOptionSettings(this.exchangeId).subscribe({
      next: (data: OptionSettingModel[]) => {
        this.allOptions = data.map(option => {
          const selected = option.type === 'Radiobutton' || option.type === 'Dropdown' ? option.optionValue : option.typeValues;
          return {
            ...option,
            type: this.validateOptionType(option.type),
            selectedValue: selected
          };
        });

        this.groupTitles = this.extractOptionGroups(this.allOptions);
        if (this.groupTitles.length > 0) {
          this.selectGroup(this.groupTitles[0]);
        }
      },
      error: (error) => {
        console.error('Error loading option settings:', error);
        alert('Failed to load option settings.');
      }
    });
  }



  validateOptionType(type: string | undefined): string {
    const validTypes = ['Text', 'Number', 'Dropdown', 'Checkbox', 'Radiobutton', 'File', 'Multiline', 'Email', 'Calendar', 'Slider', 'Time'];
    return validTypes.includes(type || '') ? type! : 'Text';
  }

  extractOptionGroups(options: OptionSettingModel[]): OptionGroupModel[] {
    const uniqueGroups = new Map<number, OptionGroupModel>();
    options.forEach(option => {
      if (!uniqueGroups.has(option.optionGroupId)) {
        uniqueGroups.set(option.optionGroupId, {
          optionGroupId: option.optionGroupId,
          optionGroupTittle: option.optionGroupTittle,
          exchangeId: this.exchangeId
        });
      }
    });
    return Array.from(uniqueGroups.values());
  }

  selectGroup(group: OptionGroupModel): void {
    this.selectedGroup = group;
    this.selectedGroupOptions = this.allOptions.filter(option => option.optionGroupId === group.optionGroupId);
  }

  getUpdateModel(option: OptionSettingModel): UpdateOptionModel {
    return {
      ...option,
      exchangeId: this.exchangeId
    } as UpdateOptionModel;
  }

  updateOptionValue(option: OptionSettingModel, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const originalOption = this.selectedGroupOptions.find(o => o.optionId === option.optionId);
    if (originalOption) {
      if (option.type === 'Radiobutton' || option.type === 'Dropdown') {
        originalOption.selectedValue = target.value;
      } else {
        originalOption.typeValues = target.value;
      }
    }
  }

  getTypeValues(typeValues: string | undefined): Array<{ value: string, label: string }> {
    if (!typeValues) return [];
    try {
      return JSON.parse(typeValues);
    } catch {
      return typeValues.split(',').map(item => {
        const parts = item.split(':');
        return { value: parts[0]?.trim() || '', label: parts[1]?.trim() || parts[0]?.trim() || '' };
      });
    }
  }

  updateCheckboxValue(option: OptionSettingModel, event: Event): void {
    const target = event.target as HTMLInputElement;
    const originalOption = this.selectedGroupOptions.find(o => o.optionId === option.optionId);
    if (originalOption) {
      originalOption.typeValues = target.checked ? 'true' : 'false';
    }
  }

  isChecked(value: any): boolean {
    return value === true || value === 'true';
  }


    showAlert(description: string): void {
      const textOnly = description.replace(/<\/?[^>]+(>|$)/g, "");
      alert(textOnly);
    }

  saveOptions(): void {
    const allUpdatedOptions: UpdateOptionModel[] = [];
    this.allOptions.forEach(option => {
      const updatedOption: UpdateOptionModel = {
        optionId: option.optionId,
        exchangeId: this.exchangeId,
        typeValues: option.type === 'Radiobutton' || option.type === 'Dropdown'
          ? option.selectedValue
          : option.typeValues,
        optionCode: option.optionCode,
        optionGroupId: option.optionGroupId,
        optionValue: option.optionValue
      };
      allUpdatedOptions.push(updatedOption);
    });

    this.licenseService.saveLicenseOptionSettings(allUpdatedOptions).subscribe(
      response => {
        alert('All options saved successfully!');
        this.router.navigate(['/exchangelist'], 
          //{
  //queryParams: { exchangeId: this.exchangeId}
//}
);
      },
      error => {
        alert('Failed to save options. Please try again.');
        console.error(error);
      }
    );
  }

  //updateFileValue(option: OptionSettingModel, event: Event): void {
  //  const input = event.target as HTMLInputElement;
  //  if (input.files && input.files.length > 0) {
  //    const file = input.files[0];
  //    const reader = new FileReader();
  //    reader.onload = () => {
  //      const fileContent = reader.result as string;
  //      const originalOption = this.selectedGroupOptions.find(o => o.optionId === option.optionId);
  //      if (originalOption) {
  //        originalOption.typeValues = fileContent;
  //      }
  //    };
  //    reader.readAsDataURL(file);
  //  }
  //}
}
