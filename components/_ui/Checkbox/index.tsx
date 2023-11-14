'use client';

import React from 'react';

// Radix
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

import styles from './checkbox.module.css'

export default function DashboardCheckbox(props: Checkbox.CheckboxProps) {
    return <div className={styles.container} >
        <Checkbox.Root className={styles.checkboxRoot} {...props}>
            <Checkbox.Indicator className={styles.checkboxIndicator}>
                <CheckIcon />
            </Checkbox.Indicator>
        </Checkbox.Root>
    </div>
}