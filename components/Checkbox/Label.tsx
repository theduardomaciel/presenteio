'use client';

import React from 'react';

import * as Checkbox from '@radix-ui/react-checkbox';
import DashboardCheckbox from '.';

import styles from './checkbox.module.css'

interface Props extends Checkbox.CheckboxProps {
    label?: string;
}

export default function CheckboxAndLabel({ label, ...rest }: Props) {
    return <div className={`${styles.container} ${styles.withLabel}`}>
        {label && <p>{label}</p>}
        <DashboardCheckbox {...rest} />
    </div>
}